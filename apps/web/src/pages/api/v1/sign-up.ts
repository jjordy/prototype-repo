import type { NextApiRequest, NextApiResponse } from "next";
import client from "@jjordy/data";
import { useApiRequestHandler } from "@/lib/api";
import jwt from "jsonwebtoken";
import { User } from "@/lib/User";

type Data = {
  path: string;
};

type Error = {
  error: string;
  originalError?: any;
};

async function handler(
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
    try {
      const user = new User({ email, password, ...rest });
      const profile = await user.save();
      const token = jwt.sign(
        {
          email,
          sub: profile.id,
          name: profile.name,
        },
        process.env.JWT_SECRET
      );
      res.setHeader(
        "set-cookie",
        `token=${token}; path=/; httponly; samesite=Strict;`
      );
      res.status(200).json({ path: "/" });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: "Something went wrong", originalError: err });
    }
  }
}

export default useApiRequestHandler(
  {
    POST: handler,
  },
  // dont authenticate this route
  false
);
