import mysql from "mysql2/promise";
import { env } from "../env.js";

const pool = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  database: env.DB_NAME,
  password: env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
