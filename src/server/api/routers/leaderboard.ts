import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { sql, type DBGame, type DBUser } from "~/server/db";
import type { LeaderboardUser, userGroup } from "~/types";

export const leaderboardRouter = createTRPCRouter({
  /**
   * Creates a global leaderboard for all users based on the most recent game
   * @param gameId The ID of the game to fetch results for the leaderboard
   * @returns Returns top 10 users and their results
   * @throws {TRPCError} If leaderboard creation fails
   */
  getGlobalLeaderboard: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const gameId = input.gameId;
      try {
        //check if the game exists
        const checkGameResults: Pick<DBGame, "id">[] = await sql`
                    SELECT * FROM games WHERE id = ${gameId}
                `;

        if (!checkGameResults[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Game not found",
          });
        }

        //select top 10 users
        const getTop10Users: LeaderboardUser[] = await sql`
                    SELECT users.username, plays.category_count, (plays.end_time - plays.start_time) as time
                    FROM plays JOIN users ON users.id = plays.user_id
                    WHERE plays.game_id = ${gameId}
                    ORDER BY plays.category_count ASC,
                    (plays.end_time - plays.start_time) ASC
                    LIMIT 10;
                `;

        if (!getTop10Users) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Top 10 users not found",
          });
        }

        return getTop10Users;
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

  getMostRecentGame: publicProcedure
    /**
     * Outputs the most recent game
     * @returns Returns the ID of the most recent game
     * @throws {TRPCError} If finding the most recent game fails
     */
    .query(async () => {
      try {
        const mostRecentGame: Pick<DBGame, "id">[] = await sql`
                    SELECT id FROM games
                    ORDER BY created_at DESC
                    LIMIT 1;
                `;

        if (!mostRecentGame[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Most recent game not found",
          });
        }

        return mostRecentGame[0];
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

  //delete this procedure after rebase with main
  getUserGroups: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const userId = input.userId;
      try {
        //check if the user id exists
        const checkUser: Pick<DBUser, "id">[] = await sql`
                    SELECT id FROM users WHERE id=${userId}
                `;

        if (!checkUser[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        const groups: userGroup[] = await sql`
                    SELECT DISTINCT groups.id, groups.name FROM
                    groups JOIN group_users ON group_users.group_id=groups.id
                    WHERE group_users.user_id=${userId};
                `;

        if (!groups) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User's groups not found",
          });
        }

        return groups;
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
   * Creates a local leaderboard for individual groups
   * @param groupId The ID of the group for which we are creating a leaderboard
   * @param gameId The ID of the game for which we are fetching user results
   * @returns Returns rankings and results of all players in a specific group
   * @throws {TRPCError} If creation of a local leaderboard fails
   */
  getLocalLeaderboard: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
        gameId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { groupId, gameId } = input;
      try {
        const groupRankings: LeaderboardUser[] = await sql`
                        SELECT DISTINCT users.username, plays.category_count, (plays.end_time - plays.start_time) as time FROM plays 
                        JOIN users ON users.id = plays.user_id
                        JOIN group_users ON group_users.user_id = users.id
                        WHERE plays.game_id = ${gameId} AND group_users.group_id = ${groupId}
                        ORDER BY plays.category_count ASC,
                        (plays.end_time - plays.start_time) ASC;                    `;

        if (!groupRankings) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Top 10 users per group not found",
          });
        }

        return groupRankings;
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
});
