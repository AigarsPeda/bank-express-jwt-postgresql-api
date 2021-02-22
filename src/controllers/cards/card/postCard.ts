import { Response } from "express";
import { poll } from "../../../db";
import { RequestWithUser } from "../../../types";

export const postCard = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const { user } = req.user;
    const {
      card_no,
      bank_name
    }: { card_no: number; bank_name: string } = req.body;
    // const sixRandomDigits = Math.floor(100000 + Math.random() * 900000);

    if (card_no.toString().length < 16 || card_no.toString().length > 16) {
      return res.status(400).json("cards numbers length wrong");
    }

    if (bank_name.trim().length < 2) {
      return res.status(400).json("bank name to short wrong");
    }

    try {
      await poll.query(
        `insert into cards(card_no, bank_name, client_id) 
         values($1, $2, $3)
        `,
        [card_no, bank_name.toLowerCase(), user.client_id]
      );
      res.status(201).json("created!");
    } catch (error) {
      res.status(404).json("not found!");
    }
  } else {
    res.status(401).json("unauthorized!");
  }
};
