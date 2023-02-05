import type { NextApiRequest, NextApiResponse } from "next";
import { useApiRequestHandler } from "@/lib/api";
import client from "@jjordy/data";
import { TICKET_SELECT_DATA } from "@/lib/constants";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const tickets = await client.ticket.findFirst({
    where: {
      id: query.id as Number,
    },
    select: TICKET_SELECT_DATA,
  });
  return res.json(tickets);
}

export default useApiRequestHandler({
  GET: handler,
});
