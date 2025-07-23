import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  sql,
  type DBInvite,
  type DBGroup,
  type DBGroupUser,
  type DBUser,
  type UserInvite
} from "~/server/db";

// Helper function to add a member
async function addMemberToGroup(groupId: number, userId: number) {
  const groupExists: Pick<DBGroup, "id">[] = await sql`
      SELECT id FROM groups WHERE id = ${groupId}
    `;
  if (!groupExists[0]) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Group not found",
    });
  }

  const result: boolean[] = await sql`
      INSERT INTO group_users (group_id, user_id, is_owner)
      VALUES (${groupId}, ${userId}, false)
      ON CONFLICT (group_id, user_id) DO NOTHING
      RETURNING true
    `;
  if (!result[0]) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "User is already a member or group does not exist",
    });
  }
}


export const invitesRouter = createTRPCRouter({
  /**
   * Send an invite to another person
   * @param groupId The id of the group
   * @param identifier Email or username. The user must NOT already be in the group
   * @throws {TRPCError} If the sender is not the group owner or the user is already in the group
   */
  send: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        identifier: z.string().min(1, "Username or Email is required"),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<DBInvite> => {
      const { identifier, groupId } = input;
      try {
        await sql`BEGIN;`;

        // make sure it's a valid username or email. If so, get the id.
        const result: Pick<DBUser, "id">[] = await sql`
          SELECT id FROM users WHERE email = ${identifier} OR username = ${identifier}
        `;

        const recipient = result[0];

        if (!recipient) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid username or email",
          });
        }

        // ensure that current user is the owner of this group
        const isOwnerCheck: DBGroupUser[] = await sql`
                SELECT * FROM group_users
                WHERE group_id = ${groupId} AND user_id = ${ctx.user.id} AND is_owner = true
            `;

        if (!isOwnerCheck[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Current user is not a member or is not the owner",
          });
        }

        // ensure that the recipient is not already in this group
        const recipientInGroup: DBGroupUser[] = await sql`
                SELECT * FROM group_users
                WHERE group_id = ${groupId} AND user_id = ${recipient.id}
            `;

        if (recipientInGroup[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Recipient is already a member of the group",
          });
        }

        // insert into the invites. If there already exists an invite, this operation will fail
        const inviteInsertResult: DBInvite[] = await sql`
                INSERT INTO invites (sender_id, recipient_id, group_id, status)
                VALUES (${ctx.user.id}, ${recipient.id}, ${groupId}, 'Pending')
                RETURNING *
            `;

        const newInvite = inviteInsertResult[0];
        if (!newInvite) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to send invite",
          });
        }

        await sql`COMMIT`;

        return newInvite;
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
    }),

  /**
   * Accept an invite from someone else
   * @param groupId The id of the group
   * @param senderId The sender of the invite
   * @throws {TRPCError} If this invite does not exist
   */
  accept: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        senderId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId, senderId } = input;

      try {
        await sql`BEGIN`;

        // ensure that the invite exists and is pending
        const validate: DBInvite[] = await sql`
                SELECT * 
                FROM invites
                WHERE group_id = ${groupId} AND sender_id = ${senderId} AND recipient_id = ${ctx.user.id}
            `;

        if (!validate[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invite does not exist.",
          });
        }

        await addMemberToGroup(groupId, ctx.user.id);

        const resolveInvite: boolean[] = await sql`
                DELETE FROM invites
                WHERE group_id = ${groupId} AND sender_id = ${senderId} AND recipient_id = ${ctx.user.id}
                RETURNING true
            `;

        if (!resolveInvite[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invite does not exist.",
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
    }),

  /**
   * Withdraw an invite that you sent to another person
   * @param groupId The id of the group
   * @param recipientId The id of the recipient (user). The user must NOT already be in the group
   * @throws {TRPCError} If this invite doesn't exist
   */
  withdraw: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        recipientId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId, recipientId } = input;

      try {
        await sql`BEGIN`;

        // withdraw the invite, a.k.a delete it from the table
        // An error will occur if no such invite exists
        const withdrawInvite: boolean[] = await sql`
                DELETE FROM invites
                WHERE group_id = ${groupId} AND sender_id = ${ctx.user.id} AND recipient_id = ${recipientId}
                RETURNING true
            `;

        if (!withdrawInvite[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invite does not exist.",
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
    }),

  /**
   * Decline an invite someone sent you
   * @param groupId The id of the group
   * @param senderId The sender of the invite
   * @throws {TRPCError} If this invite doesn't exist
   */
  decline: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        senderId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { groupId, senderId } = input;
      try {
        await sql`BEGIN`;

        // decline the invite and delete from the invites table
        // If there does not exist such an invite, an error is thrown.
        const declineInvite: boolean[] = await sql`
                DELETE FROM invites
                WHERE group_id = ${groupId} AND sender_id = ${senderId} AND recipient_id = ${ctx.user.id}
                RETURNING true
            `;

        if (!declineInvite[0]) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invite does not exist.",
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
    }),

  /**
   * Get all the invites where the current user is the sender
   */
  getOutboundInvites: protectedProcedure
  .input(
    z.object({
        groupId: z.number(),
      }),
  ).query(
    async ({ input, ctx }): Promise<Pick<UserInvite, "recipient_id" | "username">[]> => {
      const group_id = input.groupId;
      try {
        const outboundInvites: Pick<UserInvite, "recipient_id" | "username">[] = await sql`
                SELECT recipient_id, users.username 
                FROM invites JOIN users on users.id = invites.recipient_id
                WHERE sender_id = ${ctx.user.id} AND group_id = ${group_id}
            `;
        return outboundInvites;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    },
  ),

  /**
   * Get all the invites where the current user is the recipient
   */
  getInboundInvites: protectedProcedure.query(
    async ({ ctx }): Promise<UserInvite[]> => {
      try {
        const inboundInvites: UserInvite[] = await sql`
                SELECT sender_id, recipient_id, group_id, users.username, groups.name
                FROM invites JOIN users on users.id = invites.sender_id
                JOIN groups on groups.id = invites.group_id
                WHERE recipient_id = ${ctx.user.id}
            `;
        return inboundInvites;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        });
      }
    },
  ),
});
