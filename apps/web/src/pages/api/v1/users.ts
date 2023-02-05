import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken, useApiRequestHandler } from "@/lib/api";
import client from "@jjordy/data";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const users = await client.user.findMany({
      select: { id: true, name: true },
    });
    res.json(users);
  } catch (err) {
    console.log(err);
  }
}

export default useApiRequestHandler({
  GET: handler,
});
