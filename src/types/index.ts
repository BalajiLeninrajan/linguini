import { type DBUser } from "~/server/db";

export type User = Omit<DBUser, "password" | "created_at">;
