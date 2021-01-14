import { Response } from "express";
import { poll } from "../../db";
import { RequestWithUser } from "../../types";

export const createClientsAccount = async (
  req: RequestWithUser,
  res: Response
) => {
  if (req.user) {
    const { user } = req.user;
    const { account_no, bank_name } = req.body;
    // const sixRandomDigits = Math.floor(100000 + Math.random() * 900000);
    try {
      await poll.query(
        `insert into accounts(account_no, bank_name, client_id) 
         values($1, $2, $3)
        `,
        [account_no, bank_name.toLowerCase(), user.client_id]
      );
      res.status(201).json("created!");
    } catch (error) {
      res.status(404).json("not found!");
    }
  } else {
    res.status(401).json("unauthorized!");
  }
};
