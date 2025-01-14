import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";

export function middleware(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore: TODO: Fix this
  const token = req.headers["authorization"] ?? "";

  const decoded = jwt.verify(token, JWT_SECRET);

  if (decoded) {
    //@ts-ignore: TODO: Fix this
    req.userId = decoded.userId;
    next();
  } else {
    //@ts-ignore: TODO: Fix this
    res.status(403).json({
      message: "Unauthorized",
    });
  }
}
