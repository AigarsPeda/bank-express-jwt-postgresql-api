import { Response } from "express";
import { poll } from "../../../db";
import { RequestWithUser } from "../../../types";

export const getLenders = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const { user } = req.user;
    try {
      // check if cards is lender and owner is deferent client
      // (not who is making request)
      const result = await poll.query(
        "SELECT * FROM cards WHERE lender = $1 AND NOT client_id = $2",
        [true, user.client_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(404).json("not found!");
    }
  } else {
    res.status(401).json("unauthorized!");
  }
};
