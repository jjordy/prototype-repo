import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken, useApiRequestHandler } from "@/lib/api";
import { User } from "@/lib/User";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getAuthToken(req);
  if (token?.sub) {
    const user = new User(token.sub);
    const profile = await user.profile();
    return res.json(profile);
  }
}

async function updateUserHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // password will not be updated but we need to pass something to our upsert handler
    const user = new User({ ...req.body, password: "" });
    await user.save();
    res.status(204).end();
  } catch (err) {
    console.log(err);
  }
}

export default useApiRequestHandler({
  GET: handler,
  PUT: updateUserHandler,
});
