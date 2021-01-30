import { Response } from "express";
import { poll } from "../../db";
import { RequestWithUser } from "../../types";

export const getUser = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const { user } = req.user;
    // const {
    //   card_no,
    //   bank_name
    // }: { card_no: number; bank_name: string } = req.body;

    try {
      const foundClient = await poll.query(
        "SELECT name, surname, email, created_on, client_id, clients_total_balance FROM clients WHERE client_id = $1",
        [user.client_id]
      );

      res.status(200).json(foundClient.rows[0]);
    } catch (error) {
      res.status(404).json("not found!");
    }
  } else {
    res.status(401).json("unauthorized!");
  }
};
