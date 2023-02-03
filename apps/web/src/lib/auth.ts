import crypto from "node:crypto";
import jwt from "jsonwebtoken";

/**
 * Authentication Helpers
 * Server only
 */

type Token = {
  email: string;
  iat: number;
  sub: number;
  name?: string;
};

export function validPassword(password: string, hash: string, salt: string) {
  const password_hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  console.log(password_hash, hash);
  return password_hash === hash;
}

export function decodeToken(token: string) {
  const decoded = jwt.decode(token);
  if (decoded) {
    return decoded as unknown as Token;
  }
}
