import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import client from "@jjordy/data";
import { decodeToken } from "@/lib/auth";

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
    const token = decodeToken(cookies["token"]);
    if (token?.sub) {
      const user = await client.user.findFirst({
        where: { id: token.sub },
        select: {
          id: true,
          email: true,
          name: true,
          address_1: true,
          address_2: true,
          city: true,
          state: true,
          zip_code: true,
          phone_number: true,
        },
      });
      return res.json(user);
    }
  }
  return res.status(401).end();
}
