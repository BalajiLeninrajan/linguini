import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { sql, type DBUser } from "~/server/db";
import { signJWT } from "~/server/utils/jwt";
import type { User } from "~/types";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        username: z
          .string()
          .min(3, "Username must be at least 3 characters long"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
      }),
    )
    .mutation(async ({ input }) => {
      const { email, username, password } = input;
      try {
        await sql`BEGIN`;

        const existingUsers: Pick<DBUser, "id">[] = await sql`
          SELECT id FROM users WHERE email = ${email} OR username = ${username}
        `;
        if (existingUsers.length > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email or username already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result: User[] = await sql`
          INSERT INTO users (email, username, password) VALUES (${email}, ${username}, ${hashedPassword})
          RETURNING email, username, id
        `;

        const newUser = result[0];
        if (!newUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to register user",
          });
        }

        const token = signJWT({
          userId: newUser.id,
        });

        await sql`COMMIT`;
        return {
          user: newUser,
          token,
        };
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

  login: publicProcedure
    .input(
      z.object({
        identifier: z.string().min(1, "Username or Email is required"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
      }),
    )
    .mutation(async ({ input }) => {
      const { identifier, password } = input;

      try {
        const result: DBUser[] = await sql`
        SELECT * FROM users WHERE email = ${identifier} OR username = ${identifier}
      `;

        const user = result[0];
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or email",
          });
        }

        if (!(await bcrypt.compare(password, user.password))) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid password",
          });
        }

        const token = signJWT({
          userId: user.id,
        });

        return {
          user: user as User,
          token,
        };
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

  currentUser: publicProcedure.query(async ({ ctx }) => ctx.user),

  refreshToken: protectedProcedure.mutation(({ ctx }) => {
    const token = signJWT({
      userId: ctx.user.id,
    });
    return { token };
  }),
});
