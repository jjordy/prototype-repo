import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import client from "@jjordy/data";
import { decodeToken } from "@/lib/auth";
import { useRestrictToMethod } from "@/lib/api";
import { User } from "@/lib/User";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { cookies } = req;
  const { JWT_SECRET } = process.env;
  if (
    cookies["token"] &&
    JWT_SECRET &&
    jwt.verify(cookies["token"], JWT_SECRET)
  ) {
    const token = decodeToken(cookies["token"]);
    if (token?.sub) {
      const user = new User(token.sub);
      const profile = await user.profile();
      return res.json(profile);
    }
  }
  return res.status(401).end();
}

export default useRestrictToMethod("GET", handler);
