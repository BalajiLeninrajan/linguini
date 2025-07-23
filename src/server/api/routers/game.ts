import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { sql, type DBGame, GameModeType } from "~/server/db";

async function getTodaysGame() {
  try {
    const existingGame: Pick<DBGame, "id">[] = await sql`
      SELECT id FROM games WHERE DATE(created_at) = CURRENT_DATE)
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
   * Creates a new game
   * @param gameMode name of the game mode
   * @param seed the seed for the game
   * @param createdAt the date and time the game was created at
   * @returns the created game data
   * @throws {TRPCError} If game creation fails
   */
  createGame: protectedProcedure
    .input(
      z.object({
        gameMode: z.nativeEnum(GameModeType),
        seed: z.number(),
      }),
    )
    .mutation(async ({ input }): Promise<DBGame> => {
      const { gameMode, seed } = input;
      try {
        await sql`BEGIN`;

        const existingGameId: number = await getTodaysGame();

        if(existingGameId){
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "A game has already been created for today",
          });
        }

        const gameInsertResult: DBGame[] = await sql`
          INSERT INTO games (game_mode, seed)
          VALUES (${gameMode}, ${seed})
          RETURNING id, game_mode, seed, created_at
        `;

        const newGame = gameInsertResult[0];
        if (!newGame) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create game",
          });
        }

        await sql`COMMIT`;
        return newGame;
      } catch (error) {
        await sql`ROLLBACK`;

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create game",
        });
      }
    }),

  /**
   * Gets the game ID for today's game
   * @returns The game ID for today's game
   * @throws {TRPCError} If an unexpected error occurs
   */
  getTodaysGame: publicProcedure
    .query(async () => {
      return await getTodaysGame();
    }),
});