import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

interface UserPayload {
  id: string;
  email: string;
}

/**
 *
 * Typescript's way to explicitly modify an existing type definition
 * In this case, it was the Request object
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // this translates to: if(!req.session || !req.session.jwt) in typescript
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    console.log("User is not logged in");
  }

  next();
};
