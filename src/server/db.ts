import { neon } from "@neondatabase/serverless";
import { env } from "~/env";

export const sql = neon(env.DATABASE_URL) as <T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<T>;

// Create types for database tables

// enums
export enum InviteStatus {
  Pending,
  Accepted,
  Rejected,
}

export enum GameModeType {
  Classic,
  Timed,
  Categories,
}

export enum WordRequestStatus {
  Pending,
  Accepted,
  Rejected,
}

// groups table
export interface DBGroup {
  id: number;
  name: string;
  created_at: Date;
}

// users table
export interface DBUser {
  id: number;
  email: string;
  username: string;
  password: Buffer;
  created_at: Date;
}

// group_users table
export interface DBGroupUser {
  group_id: number;
  user_id: number;
  is_owner: boolean;
}

// invites table
export interface DBInvite {
  sender_id: number;
  recipient_id: number;
  group_id: number;
  send_date: Date;
  status: InviteStatus;
}

// games table
export interface DBGame {
  id: number;
  game_mode: GameModeType;
  seed: number;
  created_at: Date;
}

// plays table
export interface DBPlay {
  game_id: number;
  user_id: number;
  category_count: number;
  start_time: Date;
  end_time?: Date;
}

// categories table
export interface DBCategory {
  category: string;
}

// word_categories table
export interface DBWordCategory {
  word: string;
  category: string;
}

// word_requests table
export interface DBWordRequest {
  id: number;
  user_id: number;
  word: string;
  category: string;
  status: WordRequestStatus;
}
