import type { NextApiRequest, NextApiResponse } from "next";
import { useApiRequestHandler } from "@/lib/middleware/apiHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;
  res.setHeader(
    "set-cookie",
    `token=${token}; path=/; httponly; samesite=Strict;`
  );
  return res.status(204).end();
}

export default useApiRequestHandler(
  {
    POST: handler,
  },
  false
);
