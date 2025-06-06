import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sql } from "~/server/db";

type Post = {
  id: number;
  message: string;
};

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
      const result = await sql<Post[]>`
        INSERT INTO hello_world (message)
        VALUES (${input.name})
        RETURNING id, message
      `;

      if (!result[0]) {
        throw new Error("Failed to create post");
      }

      return result[0];
    }),

  getLatest: publicProcedure.query(async () => {
    const result = await sql<Post[]>`
      SELECT id, message
      FROM hello_world
      ORDER BY id DESC
      LIMIT 1
    `;

    return result[0] ?? null;
  }),
});
