import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

import { sql, type DBGame } from "~/server/db";

async function getTodaysGame() {
  try {
    const existingGame: Pick<DBGame, "id">[] = await sql`
      SELECT id FROM games WHERE DATE(created_at) = CURRENT_DATE
    `;

    if (existingGame[0]) {
      return existingGame[0].id;
    }

    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No game exists for today",
    });
  } catch (error) {
    console.error("Error getting today's game:", error);
    if (error instanceof TRPCError) {
      throw error;
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to get today's game: ${error instanceof Error ? error.message : "Unknown error"}`,
    });
  }
}

export const gameRouter = createTRPCRouter({
  /**
   * Gets the game ID for today's game
   * @returns The game ID for today's game
   * @throws {TRPCError} If an unexpected error occurs
   */
  getTodaysGame: publicProcedure.query(async () => {
    return await getTodaysGame();
  }),
});