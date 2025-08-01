import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sql, type DBGame, type DBPlay } from "~/server/db";

async function createPlay(gameId: number, userId: number, startTime: Date) {
  try {
    await sql`BEGIN`;

    const playExists: Pick<DBPlay, "game_id">[] = await sql`
            SELECT game_id FROM plays WHERE user_id = ${userId} AND game_id = ${gameId}
        `;
    if (playExists[0]) {
      return;
    }

    const gameResult: Pick<DBGame, "id">[] = await sql`
            SELECT id FROM games WHERE id = ${gameId}
        `;

    if (!gameResult[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Game does not exist",
      });
    }

    const result: boolean[] = await sql`
            INSERT INTO plays (game_id, user_id, category_count, start_time)
            VALUES (${gameId}, ${userId}, 0, ${startTime})
            RETURNING true
        `;
    if (!result[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Play creation failed",
      });
    }
    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    console.error("Database error:", error);
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Database error: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}

async function playExists(gameId: number, userId: number) {
  try {
    const result: DBPlay[] = await sql`
      SELECT * FROM plays WHERE user_id = ${userId} AND game_id = ${gameId}
    `;
    if (!result[0]) {
      return null;
    }
    return result[0];
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

async function endPlay(
  gameId: number,
  userId: number,
  categoryCount: number,
  endTime: Date,
) {
  try {
    await sql`BEGIN`;

    const playExists: Pick<DBPlay, "game_id">[] = await sql`
            SELECT game_id FROM plays WHERE user_id = ${userId} AND game_id = ${gameId}
        `;
    if (!playExists[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Play does not exist",
      });
    }

    const gameExists: Pick<DBGame, "id">[] = await sql`
            SELECT id FROM games WHERE id = ${playExists[0].game_id}
        `;
    if (!gameExists[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Game does not exist",
      });
    }

    const result: boolean[] = await sql`
            UPDATE plays SET category_count = ${categoryCount}, end_time = ${endTime} WHERE user_id = ${userId} AND game_id = ${gameId}
            RETURNING true
        `;

    if (!result[0]) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Play end failed",
      });
    }
    await sql`COMMIT`;
    return true;
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

export const playRouter = createTRPCRouter({
  /**
   * Creates a new play for a user in a game
   * @param gameId The ID of the game
   * @param userId The ID of the user
   * @throws {TRPCError} If an unexpected error occurs
   */
  addPlay: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        userId: z.number(),
        startTime: z.date(),
      }),
    )

    .mutation(async ({ input }) => {
      const { gameId, userId, startTime } = input;
      await createPlay(gameId, userId, startTime);
    }),

  /**
   * Checks if a play exists for a user in a game
   * @param gameId The ID of the game
   * @param userId The ID of the user
   * @returns True if the play exists, false otherwise
   * @throws {TRPCError} If an unexpected error occurs
   */
  playExists: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        userId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const { gameId, userId } = input;
      return await playExists(gameId, userId);
    }),

  /**
   * Ends a play for a user in a game
   * @param gameId The ID of the game
   * @param userId The ID of the user
   * @param categoryCount The number of categories the user has completed
   * @param endTime The time the play ended
   * @returns True if the play ended successfully
   * @throws {TRPCError} If an unexpected error occurs
   */
  endPlay: publicProcedure
    .input(
      z.object({
        gameId: z.number(),
        userId: z.number(),
        categoryCount: z.number(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ input }) => {
      const { gameId, userId, categoryCount, endTime } = input;
      return await endPlay(gameId, userId, categoryCount, endTime);
    }),
});
