import { neon, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { env } from "~/env";

const DEV_CONFIG = {
  connectionString: "postgres://postgres:postgres@db.localtest.me:5432/main",
  fetchEndpoint: (host: string) => {
    const [protocol, port] =
      host === "db.localtest.me" ? ["http", 4444] : ["https", 443];
    return `${protocol}://${host}:${port}/sql`;
  },
  wsProxy: (host: string) =>
    host === "db.localtest.me" ? `${host}:4444/v2` : `${host}/v2`,
  useSecureWebSocket: false,
};

if (env.USE_LOCAL) {
  neonConfig.fetchEndpoint = DEV_CONFIG.fetchEndpoint;
  neonConfig.wsProxy = DEV_CONFIG.wsProxy;
  neonConfig.useSecureWebSocket = DEV_CONFIG.useSecureWebSocket;
  neonConfig.webSocketConstructor = ws;
}

export const sql = neon(
  env.USE_LOCAL ? DEV_CONFIG.connectionString : env.DATABASE_URL,
) as <T = unknown>(
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
  password: string;
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
  user_id: number;
  word: string;
  category: string;
  status: WordRequestStatus;
}

export interface LeaderboardUser {
  username: string;
  category_count: number;
  time: number;
}

//delete after rebase with main
export interface userGroup {
  id: string;
  name: string;
}

export interface UserInvite {
  sender_id: number;
  recipient_id: number;
  group_id: number;
  username: string;
  name: string;
}