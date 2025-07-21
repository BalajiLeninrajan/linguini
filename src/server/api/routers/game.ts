import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { sql, type DBGame, GameModeType } from "~/server/db";
import type { Game } from "~/types";


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
        createdAt: z.date(),
      }),
    )
    .mutation(async ({ input }): Promise<DBGame> => {
      const { gameMode, seed, createdAt } = input;
      try {
        await sql`BEGIN`;
        const gameInsertResult: DBGame[] = await sql`
          INSERT INTO games (game_mode, seed, created_at)
          VALUES (${gameMode}, ${seed}, ${createdAt})
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
});
