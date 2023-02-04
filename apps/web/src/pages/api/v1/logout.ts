import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { cookies } = req;
  const { JWT_SECRET } = process.env;
  if (
    cookies["token"] &&
    JWT_SECRET &&
    jwt.verify(cookies["token"], JWT_SECRET)
  ) {
    res.setHeader("set-cookie", "token=; max-age=-1; samesite=strict; path=/;");
    return res.redirect("/sign-in");
  }
  return res.status(401).end();
}
