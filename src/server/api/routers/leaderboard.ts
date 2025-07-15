import { TRPCError } from "@trpc/server";
import { create } from "domain";
import { isReturnStatement } from "typescript";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { sql, type DBGame, type DBGroup, type DBGroupUser } from "~/server/db";
import type { Group, User } from "~/types";

export const leaderboardRouter = createTRPCRouter({
    getGlobalLeaderboard: publicProcedure
        .input(
            z.object({
                gameId: z.string(),
            }),
        )
        .query(async ({input}) => {
            const gameId = input.gameId;
            try{
                
                //check if the game exists
                const checkGameResults: Pick<DBGame, "id">[] = await sql`
                    SELECT * FROM games WHERE id = ${gameId}
                `;

                if(!checkGameResults[0]){
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Game not found",
                    });
                }


                //select top 10 users
                const getTop10Users = await sql`
                    SELECT users.username, plays.category_count, (plays.end_time - plays.start_time) as time
                    FROM plays JOIN users ON users.id = plays.user_id
                    WHERE plays.game_id = ${gameId}
                    ORDER BY plays.category_count ASC,
                    (plays.end_time - plays.start_time) ASC
                    LIMIT 10;
                `

                if(!getTop10Users){
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: "Top 10 users not found",
                    });
                }

                return getTop10Users;

            }catch(error){
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