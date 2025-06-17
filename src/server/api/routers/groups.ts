import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sql, type DBGroup, type DBGroupUser } from "~/server/db";
import type { Group, User } from "~/types";

// Helper function to add a member
async function addMemberToGroup(groupId: number, userId: number) {
  try {
    await sql`BEGIN`;
    const result: DBGroupUser[] = await sql`
      INSERT INTO group_users (group_id, user_id, is_owner)
      VALUES (${groupId}, ${userId}, false)
      ON CONFLICT (group_id, user_id) DO NOTHING
      RETURNING *
    `;
    if (!result[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is already a member or group does not exist",
      });
    }
    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
}

// Helper function to remove a member
async function removeMemberFromGroup(groupId: number, userId: number) {
  try {
    await sql`BEGIN`;
    const result: DBGroupUser[] = await sql`
      DELETE FROM group_users
      WHERE group_id = ${groupId} AND user_id = ${userId} AND is_owner = false
      RETURNING *
    `;
    if (!result[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User is not a member or is the owner",
      });
    }
    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
}

export const groupsRouter = createTRPCRouter({
  /**
   * Creates a new group with the current user as owner
   * @param name The name of the group to create
   * @returns The newly created group with owner and initial member
   * @throws {TRPCError} If group creation fails
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Group name is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { name } = input;
      try {
        await sql`BEGIN`;
        const groupInsertResult: DBGroup[] = await sql`
          INSERT INTO groups (name)
          VALUES (${name})
          RETURNING *
        `;
        const newGroupRow = groupInsertResult[0];
        if (!newGroupRow) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create group",
          });
        }

        const ownerInsertResult: DBGroupUser[] = await sql`
          INSERT INTO group_users (group_id, user_id, is_owner)
          VALUES (${newGroupRow.id}, ${ctx.user.id}, true)
          RETURNING *
        `;
        const newGroupUserRow = ownerInsertResult[0];
        if (!newGroupUserRow) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create group",
          });
        }
        await sql`COMMIT`;

        return {
          ...newGroupRow,
          owner: ctx.user,
          members: [ctx.user],
        } as Group;
      } catch (error) {
        await sql`ROLLBACK`;

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),

  /**
   * Updates a group's name if the current user is the owner
   * @param groupId The ID of the group to update
   * @param name The new name for the group
   * @throws {TRPCError} If group not found or user isn't the owner
   */
  update: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        name: z.string().min(1, "Group name is required"),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId, name } = input;
      try {
        await sql`BEGIN`;

        const ownerCheckResult: DBGroupUser[] = await sql`
          SELECT is_owner FROM group_users
          WHERE group_id = ${groupId} AND user_id = ${ctx.user.id}
        `;
        if (!ownerCheckResult[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }
        if (!ownerCheckResult[0].is_owner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the group owner can update the group",
          });
        }

        const result: DBGroup[] = await sql`
          UPDATE groups
          SET name = ${name}
          WHERE id = ${groupId}
          RETURNING *
        `;
        if (!result[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }
        await sql`COMMIT`;
      } catch (error) {
        await sql`ROLLBACK`;

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),

  /**
   * Deletes a group and all its memberships if the current user is the owner
   * @param groupId The ID of the group to delete
   * @throws {TRPCError} If group not found or user isn't the owner
   */
  delete: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId } = input;
      try {
        await sql`BEGIN`;

        const ownerCheckResult: DBGroupUser[] = await sql`
          SELECT is_owner FROM group_users
          WHERE group_id = ${groupId} AND user_id = ${ctx.user.id}
        `;
        if (!ownerCheckResult[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }
        if (!ownerCheckResult[0].is_owner) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only the group owner can delete the group",
          });
        }

        await sql`
          DELETE FROM group_users WHERE group_id = ${input.groupId}
        `;
        const result: number[] = await sql`
          DELETE FROM groups
          WHERE id = ${input.groupId}
          RETURNING id
        `;
        if (!result[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }

        await sql`COMMIT`;
      } catch (error) {
        await sql`ROLLBACK`;

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),

  /**
   * Retrieves all group IDs in the system
   * @returns Array of group IDs
   */
  getAllGroupIds: protectedProcedure.query(async () => {
    const result: Pick<DBGroup, "id">[] = await sql`
      SELECT id
      FROM groups
    `;
    return result.map((e) => e.id);
  }),

  /**
   * Retrieves detailed information about a specific group
   * @param groupId The ID of the group to retrieve
   * @returns Group details including owner and member information
   * @throws {TRPCError} If group not found
   */
  getGroupFromId: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { groupId } = input;
      try {
        const groupRows: (DBGroup & { owner_id: number })[] = await sql`
          SELECT g.*, gu.user_id AS owner_id
          FROM groups AS g
          JOIN group_users AS gu ON gu.group_id = g.id AND gu.is_owner = true
          WHERE g.id = ${groupId}
        `;
        const groupRow = groupRows[0];
        if (!groupRow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Group not found",
          });
        }

        const memberRows: User[] = await sql`
          SELECT u.id, u.email, u.username
          FROM users AS u
          JOIN group_users AS gu ON gu.user_id = u.id
          WHERE gu.group_id = ${groupId}
        `;

        const owner = memberRows.find((u) => u.id === groupRow.owner_id);
        if (!owner) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Group owner not found",
          });
        }

        return {
          ...groupRow,
          owner,
          members: memberRows,
        } as Group;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    }),

  /**
   * Adds a user to a group (admin operation)
   * @param groupId The ID of the group
   * @param userId The ID of the user to add
   * @throws {TRPCError} If group not found or operation fails
   */
  addMember: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        userId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { groupId, userId } = input;
      await addMemberToGroup(groupId, userId);
    }),

  /**
   * Removes a user from a group (admin operation)
   * @param groupId The ID of the group
   * @param userId The ID of the user to remove
   * @throws {TRPCError} If group not found or operation fails
   */
  removeMember: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        userId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      const { groupId, userId } = input;
      await removeMemberFromGroup(groupId, userId);
    }),

  /**
   * Allows the current user to join a group
   * @param groupId The ID of the group to join
   * @throws {TRPCError} If group not found or operation fails
   */
  joinGroup: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { groupId } = input;
      await addMemberToGroup(groupId, ctx.user.id);
    }),

  /**
   * Allows the current user to leave a group
   * @param groupId The ID of the group to leave
   * @throws {TRPCError} If group not found or operation fails
   */
  leaveGroup: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const { groupId } = input;
      await removeMemberFromGroup(groupId, ctx.user.id);
    }),
});
