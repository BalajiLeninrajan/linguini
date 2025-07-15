import type { DBUser, DBGroup } from "~/server/db";

export type User = Omit<DBUser, "password" | "created_at">;

export type Group = DBGroup & {
  owner: User;
  members: User[];
};

export type Leader = {
  username: string;
  category_count: number;
  time: Date;
}