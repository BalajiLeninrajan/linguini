import jwt from "jsonwebtoken";
import { env } from "~/env.js";

export interface JWTPayload {
  userId: number;
}

export function signJWT(payload: JWTPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}
