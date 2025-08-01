import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sql, type DBWordCategory, type DBCategory } from "~/server/db";


export const wordsCategoriesRouter = createTRPCRouter({
  /**
   * Verify if the word entered by the user matches the category
   * @param word The word entered by the user
   * @param category The category that was provided
   * @throws {TRPCError} If something goes wrong
   */
  verify: publicProcedure
    .input(
      z.object({
        word: z.string().min(1, "Word is required"),
        category: z.string().min(1, "Category is required"),
      }),
    )
    .mutation(async ({ input }): Promise<boolean> => {
      const { word, category } = input;
      try {
        const response: DBWordCategory[] = await sql`
            WITH RECURSIVE
            Search(word, category, depth) AS (
                SELECT word, category, 0 from word_categories WHERE word = ${word}

                UNION

                SELECT s.word, wc.category, s.depth + 1
                FROM search s, word_categories wc
                WHERE s.category = wc.word AND s.word != wc.category AND s.depth < 5
            )
            SELECT *
            FROM search
            WHERE word = ${word} AND category = ${category}
        `;
        return response.length != 0;
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
   * Generate category list from the game seed
   * @throws {TRPCError} If something goes wrong
   */
  generateCategoriesList: publicProcedure
  .input(
      z.object({
        seed: z.number().min(0).lt(1)
      }),
    ).query(
    async ({input}): Promise<DBCategory[]> => {
      const {seed} = input;
      try {
        await sql`SELECT SETSEED(0.42)`;
        const categoriesList: DBCategory[] = await sql`
            SELECT category
            FROM categories
            ORDER BY RANDOM();
        `;
        return categoriesList;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    },
  ),
});
