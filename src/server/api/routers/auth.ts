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
  /**
   * Registers a new user with email, username, and password.
   * - Checks for existing email or username.
   * - Hashes the password before storing.
   * - Returns the new user and a JWT token on success.
   * @param email User's email address
   * @param username Desired username
   * @param password Plaintext password
   * @returns { token }
   * @throws {TRPCError} If email or username exists, or registration fails
   */
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
    .mutation(async ({ input }): Promise<{ token: string }> => {
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

        const result: Pick<DBUser, "id">[] = await sql`
          INSERT INTO users (email, username, password) VALUES (${email}, ${username}, ${hashedPassword})
          RETURNING id
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
        return { token };
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
   * Logs in a user using email or username and password.
   * - Verifies user existence and password correctness.
   * - Returns the user and a JWT token on success.
   * @param identifier Email or username
   * @param password Plaintext password
   * @returns { token }
   * @throws {TRPCError} If credentials are invalid or login fails
   */
  login: publicProcedure
    .input(
      z.object({
        identifier: z.string().min(1, "Username or Email is required"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
      }),
    )
    .mutation(async ({ input }): Promise<{ token: string }> => {
      const { identifier, password } = input;

      try {
        const result: Pick<DBUser, "id" | "password">[] = await sql`
          SELECT id, password FROM users WHERE email = ${identifier} OR username = ${identifier}
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

        return { token };
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
   * Returns the currently authenticated user from the context.
   * @returns The current user object or null if not authenticated
   */
  currentUser: publicProcedure.query(
    async ({ ctx }): Promise<User | null> => ctx.user,
  ),

  /**
   * Issues a new JWT token for the currently authenticated user.
   * @returns { token } New JWT token
   */
  refreshToken: protectedProcedure.mutation(
    async ({ ctx }): Promise<{ token: string }> => {
      const token = signJWT({
        userId: ctx.user.id,
      });
      return { token };
    },
  ),
});
