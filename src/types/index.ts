import type { DBUser, DBGroup } from "~/server/db";

export type User = Omit<DBUser, "password" | "created_at">;

export type Group = DBGroup & {
  owner: User;
  members: User[];
};

export type LeaderboardUser = {
  username: string;
  category_count: number;
  time: number;
};

export type TimeValue = number | { minutes: number } | null | undefined;

export type userGroup = {
  id: string;
  name: string;
};
