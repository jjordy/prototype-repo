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
    return res.status(200).end();
  }
  return res.status(401).end();
}
