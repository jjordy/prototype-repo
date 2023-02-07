import type { NextApiRequest, NextApiResponse } from "next";
import { useApiRequestHandler } from "@/lib/middleware/apiHandler";
/**
 * logout endpoint
 * Will clear the cookie named token
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("set-cookie", "token=; max-age=-1; samesite=strict; path=/;");
  return res.redirect("/sign-in");
}

export default useApiRequestHandler({
  GET: handler,
});
