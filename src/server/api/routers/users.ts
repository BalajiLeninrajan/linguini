import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sql, type DBGroupUser } from "~/server/db";
import type { User } from "~/types";

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

export const userRouter = createTRPCRouter({
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

  deleteCurrentUser: protectedProcedure.mutation(
    async ({ ctx }) => await deleteUser(ctx.user.id),
  ),

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

  getCurrentUserOwnedGroups: protectedProcedure.query(async ({ ctx }) => {
    return await getUserGroupIds(ctx.user.id, true);
  }),

  getGroupMembershipsById: protectedProcedure
    .input(
      z.object({
        userId: z.number().nonnegative(),
      }),
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await getUserGroupIds(userId);
    }),

  getCurrentUserGroupMemberships: protectedProcedure.query(async ({ ctx }) => {
    return await getUserGroupIds(ctx.user.id);
  }),
});
