import { Response } from "express";
import { getClient } from "../../db";
import { RequestWithUser } from "../../types";

export const deposit = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const client = await getClient();
    if (!client) return res.status(503).json("no connection with db");
    try {
      await client.query("begin");
      const { user } = req.user;
      const { card_id } = req.params;
      const { deposit_amount }: { deposit_amount: number } = req.body;

      // deposit should be positive number
      if (deposit_amount < 0) res.status(400).json("bad request");

      const result = await client.query(
        "select total_balance from cards where card_id = $1 AND client_id = $2",
        [parseInt(card_id), user.client_id]
      );
      const total_balance = +result.rows[0].total_balance;

      // deposit or withdraw
      const total = total_balance + deposit_amount;
      const transaction_date = new Date();
      await client.query(
        `insert into transactions(transaction_date, deposit_amount, card_id, balance) 
           values($1,$2,$3,$4) 
           returning *
          `,
        [transaction_date, deposit_amount, card_id, total]
      );

      // adding to account total balance
      await client.query(
        "update cards set total_balance = total_balance + $1 where card_id=$2",
        [deposit_amount, card_id]
      );

      // adding to clients total balance
      await client.query(
        "update clients set clients_total_balance = clients_total_balance + $1 where client_id=$2",
        [deposit_amount, user.client_id]
      );

      await client.query("commit");

      res.status(200).json("deposit successful!");
    } catch (error) {
      await client.query("rollback");
      res.status(400).send({
        add_error: "Error while depositing amount..Try again later."
      });
    } finally {
      client.release();
    }
  }
};
