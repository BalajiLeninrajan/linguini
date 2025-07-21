import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { sql, type DBGroupUser } from "~/server/db";
import type { User } from "~/types";

// helper function to get user group IDs
async function getUserGroupIds(
  userId: number,
  owner = false,
): Promise<Pick<DBGroupUser, "group_id">[]> {
  try {
    const result: Pick<DBGroupUser, "group_id">[] = await sql`
      SELECT group_id FROM group_users
      WHERE user_id = ${userId}
      ${owner ? sql`AND is_owner = TRUE` : sql``}
    `;

    return result;
  } catch (error) {
    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
    });
  }
}

// helper function to delete a user and their groups
async function deleteUser(userId: number) {
  try {
    await sql`BEGIN`;

    const deleteUserResult: boolean[] = await sql`
      DELETE FROM users 
      WHERE id = ${userId} 
      RETURNING true
    `;

    if (!deleteUserResult[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    const ownedGroups = await getUserGroupIds(userId, true);
    for (const group of ownedGroups) {
      await sql`
        DELETE FROM groups WHERE group_id = ${group.group_id}
        RETURNING true
      `;
      await sql`
        DELETE FROM group_users WHERE group_id = ${group.group_id}
        RETURNING true
      `;
    }

    await sql`
      DELETE FROM group_users WHERE user_id = ${userId}
    `;

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

export const usersRouter = createTRPCRouter({
  /**
   * Retrieves a user by their ID.
   * - Returns user details including email and username.
   * @param userId The ID of the user to retrieve
   * @returns User object
   * @throws {TRPCError} If user is not found
   */
  getById: protectedProcedure
    .input(
      z.object({
        userId: z.number().nonnegative(),
      }),
    )
    .query(async ({ input }): Promise<User> => {
      const { userId } = input;

      const result: User[] = await sql`
        SELECT id, email, username FROM users WHERE id = ${userId}
      `;

      if (!result[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return result[0];
    }),

  /**
   * Deletes a user by their ID.
   * - Also deletes all groups owned by the user.
   * - Removes user from all group memberships.
   * @param userId The ID of the user to delete
   * @throws {TRPCError} If user is not found or deletion fails
   */
  deleteByID: protectedProcedure
    .input(
      z.object({
        userId: z.number().nonnegative(),
      }),
    )
    .mutation(async ({ input }) => {
      const { userId } = input;
      await deleteUser(userId);
    }),

  /**
   * Deletes the currently authenticated user.
   * - Also deletes all groups owned by the user.
   * - Removes user from all group memberships.
   * @throws {TRPCError} If deletion fails
   */
  deleteCurrentUser: protectedProcedure.mutation(
    async ({ ctx }) => await deleteUser(ctx.user.id),
  ),

  /**
   * Gets all groups owned by a specific user.
   * @param userId The ID of the user to check ownership for
   * @returns Array of group IDs owned by the user
   * @throws {TRPCError} If query fails
   */
  getOwnedGroupsById: protectedProcedure
    .input(
      z.object({
        userId: z.number().nonnegative(),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await getUserGroupIds(userId, true);
    }),

  /**
   * Gets all groups owned by the currently authenticated user.
   * @returns Array of group IDs owned by the current user
   * @throws {TRPCError} If query fails
   */
  getCurrentUserOwnedGroups: protectedProcedure.query(async ({ ctx }) => {
    return await getUserGroupIds(ctx.user.id, true);
  }),

  /**
   * Gets all groups a specific user is a member of.
   * @param userId The ID of the user to check memberships for
   * @returns Array of group IDs the user is a member of
   * @throws {TRPCError} If query fails
   */
  getGroupMembershipsById: publicProcedure
    .input(
      z.object({
        userId: z.number().nonnegative(),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await getUserGroupIds(userId);
    }),

  /**
   * Gets all groups the currently authenticated user is a member of.
   * @returns Array of group IDs the current user is a member of
   * @throws {TRPCError} If query fails
   */
  getCurrentUserGroupMemberships: protectedProcedure.query(async ({ ctx }) => {
    return await getUserGroupIds(ctx.user.id);
  }),
});
