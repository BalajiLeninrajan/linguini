import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import pool from "~/server/db";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const [result] = await pool.query(
        "INSERT INTO hello_world (message) VALUES (?)",
        [input.name],
      );

      // Type assertion for the result object
      const insertResult = result as { insertId: number };

      return {
        id: insertResult.insertId,
        name: input.name,
      };
    }),

  getLatest: publicProcedure.query(async () => {
    const [rows] = await pool.query(
      "SELECT id, message as name FROM hello_world ORDER BY id DESC LIMIT 1",
    );

    // Type assertion for the rows array
    const posts = rows as { id: number; name: string }[];
    return posts[0] ?? null;
  }),
});
