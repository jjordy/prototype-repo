import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { useApiRequestHandler } from "@/lib/api";

/**
 * the useApiRequestHandler will authenticate
 * the user / token by default so if our auth handler is hit
 * for now we can just return a 200 res.
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).end();
}

export default useApiRequestHandler({
  GET: handler,
});
