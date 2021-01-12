import { Request, Response } from "express";
import { RequestWithUser } from "../../types";

export const clientsAccount = (req: RequestWithUser, res: Response) => {
  if (!req.user) res.status(401).json("unauthorized!");

  res.status(200).json({ user: req.user, message: "Your Account" });
};
