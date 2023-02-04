import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { IncomingHttpHeaders } from "node:http";
import { NextPageContext } from "next";

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
  return password_hash === hash;
}

export function decodeToken(token: string) {
  const decoded = jwt.decode(token);
  if (decoded) {
    return decoded as unknown as Token;
  }
  return {} as Token;
}

export function parseCookies<T = Record<string, string>>(
  headers: IncomingHttpHeaders
) {
  const items = headers?.cookie?.split(";");
  if (items) {
    const pairs = items.reduce<Record<string, string>>((acc, curr) => {
      const [one, two] = curr.split("=");
      acc[one] = two;
      return acc;
    }, {});
    return pairs;
  }
  return {};
}

export const isAuthenticated = (ctx: NextPageContext) => {
  const { headers = {} } = ctx?.req || {};
  const cookies = parseCookies(headers);
  if (process.env.JWT_SECRET) {
    const decoded = jwt.verify(cookies?.token, process.env.JWT_SECRET);
    if (decoded && typeof decoded === "object") {
      return decoded;
    }
  }
  return false;
};
