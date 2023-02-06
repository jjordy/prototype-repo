import type { NextApiRequest, NextApiResponse } from "next";
import { useApiRequestHandler } from "@/lib/api";
import client from "@jjordy/data";
import { TICKET_SELECT_DATA } from "@/lib/constants";
import { getTicketById } from "@/lib/data/ticket";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  try {
    const tickets = await getTicketById({
      id: parseInt(query.id, 10),
    });
    return res.json(tickets);
  } catch (err) {
    console.log(err);
  }
}

async function putHandler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  try {
    const updated = await client.ticket.update({
      select: TICKET_SELECT_DATA,
      data: req.body,
      // @ts-expect-error
      where: { id: parseInt(query?.id, 10) },
    });
    return res.json(updated);
  } catch (err) {
    console.log(err);
  }
}

export default useApiRequestHandler({
  GET: handler,
  PUT: putHandler,
});
