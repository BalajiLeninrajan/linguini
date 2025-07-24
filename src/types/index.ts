import type { DBUser, DBGroup } from "~/server/db";
import type { GameModeType } from "~/server/db";

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

export type TimeValue =
  | number
  | { minutes: number; seconds: number }
  | null
  | undefined;

export type userGroup = {
  id: string;
  name: string;
};

export type Game = {
  gameMode: GameModeType;
  seed: number;
  createdAt: Date;
};

export type userInvite = {
  sender_id: number;
  recipient_id: number;
  group_id: number;
  username: string;
  name: string;
};
