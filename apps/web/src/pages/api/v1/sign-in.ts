import type { NextApiRequest, NextApiResponse } from "next";
import client from "@jjordy/data";
import { validPassword } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { useRestrictToMethod } from "@/lib/api";

type Data = {
  path: string;
};

type Error = {
  error: string;
};

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  const {
    body: { password, email },
  } = req;
  const user = await client.user.findFirst({
    where: { email },
  });

  if (
    user &&
    validPassword(password, user.hash, user.salt) &&
    process.env.JWT_SECRET
  ) {
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
  } else {
    res.status(404).json({ error: "User Not Found" });
  }
}

export default useRestrictToMethod("POST", handler);
