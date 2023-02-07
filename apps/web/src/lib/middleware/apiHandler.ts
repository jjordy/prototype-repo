import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type RequestTypes = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;

type RequestHandler<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<T>;

export function useApiRequestHandler(
  methodMap: Record<RequestTypes, RequestHandler>,
  authenticate = true
) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (authenticate) {
      const { cookies } = req;
      const { JWT_SECRET } = process.env;
      if (
        cookies["token"] &&
        JWT_SECRET &&
        jwt.verify(cookies["token"], JWT_SECRET)
      ) {
      } else {
        return res.status(401).end();
      }
    }
    if (req.method && methodMap[req.method]) {
      try {
        return await methodMap[req.method](req, res);
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Error Handling Failed", originalError: err });
      }
    }
    return res.status(405).json({ error: "Method Not Allowed" });
  };
}
