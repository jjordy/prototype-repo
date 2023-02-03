import { NextApiRequest, NextApiResponse } from "next";

export function useRestrictToMethod(method: string, originalFn: any) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== method) {
      return res.status(405).end();
    }
    await originalFn(req, res);
  };
}
