import { GameModeType, sql, type DBGame } from "~/server/db";
import type { NextRequest } from "next/server";

/**
 * A helper function that creates a new game 
 * @param seed The seed that generates the categories list
 * @param gameMode The game mode. Defaults to 'Classic'
 */
async function createGame(seed: number, gameMode: GameModeType = GameModeType.Classic): Promise<DBGame | null> {
    try {
        await sql`BEGIN`;

        const existingGame: DBGame[] = await sql`
            SELECT * FROM games WHERE DATE(created_at) = CURRENT_DATE
        `;

        if (existingGame[0]) {
            console.warn("WARNING: A game has already been created for today");
            await sql`ROLLBACK`;
            return null;
        }

        const gameInsertResult: DBGame[] = await sql`
            INSERT INTO games (game_mode, seed)
            VALUES (${gameMode}, ${seed})
            RETURNING id, game_mode, seed, created_at
        `;

        const newGame = gameInsertResult[0];
        if (!newGame) {
            throw new Error("Failed to insert game.")
        }

        await sql`COMMIT`;
        return newGame;
    } catch (error) {
        await sql`ROLLBACK`;
        throw new Error("createGame() failed: " + (error instanceof Error));
    }
}


export async function GET(req: NextRequest) {
  try {
    const seed: number = parseFloat(Math.random().toFixed(8));

    await sql`SELECT SETSEED(${seed})`;

    const dbSeed: number = seed * 100000000;

    const game = await createGame(dbSeed);

    if (!game) {
      console.warn("Game already exists for today. Skipping new creation.");
      return new Response("Game already exists for today.", { status: 200 });
    }

    console.log(`Seed ${dbSeed} successfully set and new game successfully created.`);
    
    return new Response("New game created", { status: 200 });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Cron job failed:", message);
    return new Response("Internal server error", { status: 500 });
  }
}
