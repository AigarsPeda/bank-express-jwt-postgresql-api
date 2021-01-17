import { Response } from "express";
import { poll } from "../../db";
import { RequestWithUser } from "../../types";

export const getClientsCards = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const { user } = req.user;
    try {
      const result = await poll.query(
        "SELECT * FROM cards WHERE client_id = $1",
        [user.client_id]
      );
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(404).json("not found!");
    }
  } else {
    res.status(401).json("unauthorized!");
  }
};
