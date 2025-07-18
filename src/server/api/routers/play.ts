import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sql, type DBGame, type DBPlay } from "~/server/db";

async function createPlay(groupId: number, userId: number) {
    try {
        await sql`BEGIN`;

        const playExists: Pick<DBPlay, "game_id">[] = await sql`
            SELECT game_id FROM plays WHERE group_id = ${groupId} AND user_id = ${userId}
        `;
        if (playExists[0]) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Play already exists",
            });
        }
        const result: boolean[] = await sql`
            INSERT INTO plays (group_id, user_id, category_count, start_time)
            VALUES (${groupId}, ${userId}, 0, NOW())
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
              if (error instanceof TRPCError) {
                throw error;
              }
              throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected error occurred",
              });
        }
}

async function playExists(groupId: number, userId: number) {
    try {
        const result: Pick<DBPlay, "game_id">[] = await sql`
            SELECT game_id FROM plays WHERE group_id = ${groupId} AND user_id = ${userId}
        `;
        if (result[0]) {
                return true;
        }
        return false;
    } catch (error) {
        throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An unexpected error occurred",
        });
    }
}

async function endPlay(groupId: number, userId: number, categoryCount: number, endTime: Date) {
    try {
        await sql`BEGIN`;

        const playExists: Pick<DBPlay, "game_id">[] = await sql`
            SELECT game_id FROM plays WHERE group_id = ${groupId} AND user_id = ${userId}
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
            })
        }

        const result: boolean[] = await sql`
            UPDATE plays SET category_count = ${categoryCount}, end_time = ${endTime} WHERE group_id = ${groupId} AND user_id = ${userId}
            RETURNING true
        `;

        if (!result[0]) {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Play end failed",
            });
        }
        await sql`COMMIT`;
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
   * Creates a new play for a user in a group
   * @param groupId The ID of the group
   * @param userId The ID of the user
   * @throws {TRPCError} If an unexpected error occurs
   */
    addPlay: protectedProcedure
    .input(
    z.object({
        groupId: z.number(),
        userId: z.number(),
    }),
    )

    .mutation(async ({ input }) => {
        const { groupId, userId } = input;
        await createPlay(groupId, userId);
    }),


    /**
   * Checks if a play exists for a user in a group
   * @param groupId The ID of the group
   * @param userId The ID of the user
   * @returns True if the play exists, false otherwise
   * @throws {TRPCError} If an unexpected error occurs
   */
    playExists: protectedProcedure
    .input(z.object({
        groupId: z.number(),
        userId: z.number(),
    }))
    .query(async ({ input }) => {
        const { groupId, userId } = input;
        return await playExists(groupId, userId);
    }),


    /**
   * Ends a play for a user in a group
   * @param groupId The ID of the group
   * @param userId The ID of the user
   * @param categoryCount The number of categories the user has completed
   * @param endTime The time the play ended
   * @returns True if the play ended successfully, false otherwise
   * @throws {TRPCError} If an unexpected error occurs
   */
    endPlay: protectedProcedure
    .input(z.object({
        groupId: z.number(),
        userId: z.number(),
        categoryCount: z.number(),
        endTime: z.date(),
    }))
    .mutation(async ({ input }) => {
        const { groupId, userId, categoryCount, endTime } = input;
        return await endPlay(groupId, userId, categoryCount, endTime);
    }),
})