import { postRouter } from "~/server/api/routers/post";
import { authRouter } from "~/server/api/routers/auth";
import { groupsRouter } from "~/server/api/routers/groups";
import { usersRouter } from "~/server/api/routers/users";
import { wordsCategoriesRouter } from "~/server/api/routers/words-categories";
import { invitesRouter } from "./routers/invites";
import { playRouter } from "~/server/api/routers/plays";
import { wordRequestsRouter } from "~/server/api/routers/word-requests";

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { leaderboardRouter } from "./routers/leaderboard";
import { gameRouter } from "./routers/game";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  auth: authRouter,
  users: usersRouter,
  groups: groupsRouter,
  leaderboard: leaderboardRouter,
  wordCategories: wordsCategoriesRouter,
  invites: invitesRouter,
  play: playRouter,
  game: gameRouter,
  wordRequests: wordRequestsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
