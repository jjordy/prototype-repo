import type { NextApiRequest, NextApiResponse } from "next";
import { getAuthToken, useApiRequestHandler } from "@/lib/api";
import client from "@jjordy/data";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tickets = await client.ticket.findMany({});
  return res.json(tickets);
}

async function createTicketHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { sub } = getAuthToken(req);
    const {
      body: { assignee, ...rest },
    } = req;
    const data = await client.ticket.create({
      data: { assignee_id: assignee?.id, author_id: sub, ...rest },
    });
    return res.json(data);
  } catch (err) {
    console.log(err);
  }
}

export default useApiRequestHandler({
  GET: handler,
  POST: createTicketHandler,
});
