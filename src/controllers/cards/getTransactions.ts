import { Response } from "express";
import { QueryResult } from "pg";
import { poll } from "../../db";
import { RequestWithUser } from "../../types";

export const getTransactions = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const { user } = req.user;
    const { card_id } = req.params;
    const { start_date, end_date, all } = req.query;

    // check who owns this card
    const owner = await poll.query(
      "select card_id from cards where card_id = $1 AND client_id = $2",
      [parseInt(card_id), user.client_id]
    );

    // const allTransactions = await poll.query(
    //   `SELECT to_char(transaction_date, 'DD-MM-YYYY')
    //    AS formatted_date, withdraw_amount, deposit_amount, balance, transaction_id, card_id, deposit_description,  withdraw_description
    //    FROM transactions WHERE card_id =
    //    (select client_id FROM cards WHERE client_id = $1 LIMIT 1)
    //   `,
    //   [user.client_id]
    // );

    // console.log(allTransactions.rows);

    if (owner.rows.length) {
      let result: QueryResult<any>;
      try {
        if (start_date && end_date) {
          result = await poll.query(
            `SELECT to_char(transaction_date, 'DD-MM-YYYY') 
             AS formatted_date, withdraw_amount, deposit_amount, balance, transaction_id, card_id, deposit_description,  withdraw_description 
             FROM transactions WHERE 
             card_id=$1 
             AND to_char(transaction_date, 'DD-MM-YYYY') 
             between $2 and $3 ORDER BY transaction_date ASC
            `,
            [card_id, start_date, end_date]
          );
        } else {
          result = await poll.query(
            `SELECT to_char(transaction_date, 'DD-MM-YYYY') 
             AS formatted_date, withdraw_amount, deposit_amount, balance, transaction_id, card_id, deposit_description,  withdraw_description 
             FROM transactions WHERE 
             card_id=$1 
             ORDER BY transaction_date ASC
            `,
            [card_id]
          );
        }
        // console.log(result);
        res.json(result.rows);
      } catch (error) {
        console.log(error.message);
        res.status(500).json("error fetching transactions");
      }
    } else {
      res.status(401).json("unauthorized");
    }
  } else {
    res.status(401).json("unauthorized");
  }
};
