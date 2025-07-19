import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { sql, type DBWordCategory, type DBCategory } from "../../db";


export const wordsCategoriesRouter = createTRPCRouter({
  /**
   * Verify if the word entered by the user matches the category
   * @param word The word entered by the user
   * @param category The category that was provided
   * @throws {TRPCError} If something goes wrong
   */
    create: publicProcedure.input(
        z.object({
            word: z.string().min(1, "Word is required"),
            category: z.string().min(1, "Category is required")
        })
    ).query(async ({input}) : Promise<boolean> => {
        const {word, category} = input;
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
            `
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
   * Generate category list from the seed
   * @param seed The seed for today's puzzle. Assuming the seed is between 0 and 1
   * @throws {TRPCError} If something goes wrong
   */

    generateCategoriesList: publicProcedure.input(
        z.object({
            seed: z.number().gt(0).lt(1)
        })
    ).mutation(async ({input}): Promise<DBCategory[]>=>{
        const {seed} = input;

        try {
            await sql`BEGIN`;

            await sql`SELECT SETSEED(${seed})`;

            const response: DBCategory[] = await sql`
                SELECT category
                FROM categories
                ORDER BY RANDOM();
            `
            await sql`COMMIT`;
            return response;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred",
            });
        }
    })
});
