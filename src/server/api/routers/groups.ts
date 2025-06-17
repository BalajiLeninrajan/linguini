import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sql, type DBGroup, type DBGroupUser } from "~/server/db";
import type { Group } from "~/types";

export const groupsRouter = createTRPCRouter({
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
});
