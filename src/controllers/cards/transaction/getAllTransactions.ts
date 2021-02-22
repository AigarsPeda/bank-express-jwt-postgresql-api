import { Response } from "express";
import { poll } from "../../../db";
import { RequestWithUser } from "../../../types";

export const getAllTransactions = async (
  req: RequestWithUser,
  res: Response
) => {
  if (req.user) {
    const { user } = req.user;

    const allTransactions = await poll.query(
      `SELECT to_char(transaction_date, 'DD-MM-YYYY') 
       AS formatted_date, withdraw_amount, deposit_amount, balance, transaction_id, card_id, deposit_description,  withdraw_description 
       FROM transactions WHERE card_id = 
       ANY (select card_id FROM cards WHERE client_id = $1)
       ORDER BY transaction_date ASC
      `,
      [user.client_id]
    );

    // console.log(allTransactions);
    res.status(200).json(allTransactions.rows);
  } else {
    res.status(401).json("unauthorized");
  }
};

// `SELECT to_char(transaction_date, 'DD-MM-YYYY')
//        AS formatted_date, withdraw_amount, deposit_amount, balance, transaction_id, card_id, deposit_description,  withdraw_description
//        FROM transactions WHERE card_id =
//        (select card_id FROM cards WHERE client_id = $1 LIMIT 1)
//        ORDER BY transaction_date ASC
//       `
