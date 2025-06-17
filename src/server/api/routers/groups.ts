import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { type User } from "~/server/api/routers/auth";
import { sql, type DBGroup } from "~/server/db";

type Group = DBGroup & {
  users: User[];
  owner: User;
};

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
        const result: DBGroup[] = await sql`
          INSERT INTO groups (name)
          VALUES (${name})
          RETURNING *
        `;
        const group;
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
});
