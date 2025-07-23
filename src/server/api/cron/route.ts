import { gameRouter } from "~/server/api/routers/game";
import { createTRPCContext } from "~/server/api/trpc"; // context creator
import { GameModeType, sql, type DBGame } from "~/server/db";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  // secure the cron job
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const newSeed: number = parseFloat(Math.random().toFixed(8)) * 100000000;

    await sql`SELECT SETSEED(${newSeed})`;

    const ctx = await createTRPCContext({ headers: req.headers });

    const newGame: DBGame = await gameRouter.createCaller(ctx).createGame({
      gameMode: GameModeType.Classic,
      seed: newSeed,
    });

    if (!newGame) {
      // failed
      console.error("Failed to create a new game");
    } else {
      console.log("Seed successfully set and new game successfully created.");
    }
  } catch (error: any) {
    console.error(`CRON JOB FAILED WITH ERROR: ${error.message}`);
  }
}
