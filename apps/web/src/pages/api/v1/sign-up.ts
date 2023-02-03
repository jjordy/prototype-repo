import type { NextApiRequest, NextApiResponse } from "next";
import client from "@jjordy/data";
import { createPasswordHash } from "../../lib/auth";
import jwt from "jsonwebtoken";

type Data = {
  path: string;
};

type Error = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const {
    body: { password, confirm_password, email, ...rest },
  } = req;
  const existingUser = await client.user.findFirst({
    where: { email },
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: `User already exist for given email ${email}` });
  }

  if (password && process.env.JWT_SECRET) {
    const { hash, salt } = createPasswordHash(password);
    const user = await client.user.create({
      data: {
        hash,
        salt,
        email,
        ...rest,
      },
    });
    const token = jwt.sign(
      {
        email,
        sub: user.id,
        name: user.name,
      },
      process.env.JWT_SECRET
    );
    res.setHeader(
      "set-cookie",
      `token=${token}; path=/; httponly; samesite=Strict;`
    );
    res.status(200).json({ path: "/" });
  }
}
