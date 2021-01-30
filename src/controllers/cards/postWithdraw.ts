import { Response } from "express";
import { getClient } from "../../db";
import { RequestWithUser } from "../../types";

export const postWithdraw = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const client = await getClient();
    if (!client) return res.status(503).json("no connection with db");

    try {
      await client.query("begin");

      const { user } = req.user;
      const { card_id } = req.params;
      const {
        withdraw_amount,
        withdraw_description
      }: { withdraw_amount: number; withdraw_description: string } = req.body;

      // withdraw amount should be negative number
      if (withdraw_amount > 0) res.status(400).json("bad request");

      const result = await client.query(
        "select total_balance from cards where card_id = $1 AND client_id = $2",
        [parseInt(card_id), user.client_id]
      );

      // if thee are no results person who made request
      // isn't account owner
      if (!result.rows.length) res.status(401).json("unauthorized");

      const total_balance = +result.rows[0].total_balance;

      // check if client have necessary founds
      if (withdraw_amount <= total_balance) {
        const transaction_date = new Date();
        const total = total_balance - withdraw_amount * -1;

        await client.query(
          `insert into transactions(transaction_date, withdraw_amount, card_id, balance, withdraw_description) 
             values($1, $2, $3, $4, $5) 
             returning *
            `,
          [
            transaction_date,
            withdraw_amount,
            card_id,
            total,
            withdraw_description
          ]
        );

        // withdraw from account total balance
        await client.query(
          "update cards set total_balance = total_balance + $1 where card_id = $2",
          [withdraw_amount, card_id]
        );

        // withdraw from clients total balance
        await client.query(
          "update clients set clients_total_balance = clients_total_balance + $1 where client_id = $2",
          [withdraw_amount, user.client_id]
        );

        await client.query("commit");

        res.status(200).json("withdraw successful!");
      } else {
        res.status(400).json("You don't have enough balance in your account");
      }
    } catch (error) {
      await client.query("rollback");
      res.status(400).send({
        add_error: "Error while withdrawing amount..Try again later."
      });
    } finally {
      client.release();
    }
  }
};
