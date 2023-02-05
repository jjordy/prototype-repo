import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken, useApiRequestHandler } from "@/lib/api";
import client from "@jjordy/data";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tickets = await client.ticket.findMany({});
  return res.json(tickets);
}

async function createCommentHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { body } = req;
    const data = await client.comment.create({
      data: { ...body },
    });
    return res.json(data);
  } catch (err) {
    console.log(err);
  }
}

export default useApiRequestHandler({
  GET: handler,
  POST: createCommentHandler,
});
