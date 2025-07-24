import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sql, type DBWordRequest } from "~/server/db";

export const wordRequestsRouter = createTRPCRouter({
  /**
   * Create a request to add a word to a category
   * @param word The word entered by the user
   * @param category The category that was provided
   * @throws {TRPCError} If something goes wrong
   */
  create: protectedProcedure
    .input(
      z.object({
        word: z.string().min(1, "Word is required"),
        category: z.string().min(1, "Category is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { word, category } = input;
      try {
        await sql`BEGIN`;
        const existing: DBWordRequest[] = await sql`
          SELECT * FROM word_requests
          WHERE user_id = ${ctx.user.id} AND word = ${word} AND category = ${category}
        `;
        if (existing.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A request for this word already exists.",
          });
        }

        await sql`
          INSERT INTO word_requests (user_id, word, category, status)
          VALUES (${ctx.user.id}, ${word}, ${category}, 'Pending')
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
    }),
});
