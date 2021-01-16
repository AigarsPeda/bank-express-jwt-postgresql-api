import { Response } from "express";
import { getClient } from "../../db";
import { RequestWithUser } from "../../types";

export const loan = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const client = await getClient();
    if (!client) return res.status(503).json("no connection with db");

    try {
      await client.query("begin");

      const { user } = req.user;
      const { card_id } = req.params;
      const { loan_amount, borrower_card_no } = req.body;

      // deposit should be positive number
      if (loan_amount < 0) res.status(400).json("bad request");

      // getting account from witch to borrow
      const lender_result = await client.query(
        "select total_balance, client_id, card_id, lender FROM cards WHERE card_id = $1",
        [parseInt(card_id)]
      );

      const lender_total_balance = +lender_result.rows[0].total_balance;
      const lender_id = +lender_result.rows[0].client_id;
      const lender_card_id = +lender_result.rows[0].card_id;
      const lender = lender_result.rows[0].lender;

      // checking if from account is allowed to borrow
      if (!lender) res.status(400).json("bad request");

      // checking if account isn't yours
      if (user.client_id === lender_id) res.status(400).json("bad request");

      // get account id from account number
      const borrower_result = await client.query(
        "select card_id FROM cards WHERE card_no = $1",
        [parseInt(borrower_card_no)]
      );

      const borrower_card_id = +borrower_result.rows[0].card_id;

      // checking if there is enough money
      if (loan_amount <= lender_total_balance) {
        const loan_taken_date = new Date();

        // saving lone in loan table
        await client.query(
          `insert into loans(loan_taken_date, loan_amount, borrower_card_id, lender_card_id, remaining_loan_amount)
            VALUES($1, $2, $3, $4, $5)
            returning *
            `,
          [
            loan_taken_date,
            loan_amount,
            borrower_card_id,
            lender_card_id,
            loan_amount
          ]
        );

        // removing money from lender account
        await client.query(
          "update cards set total_balance = total_balance + $1 where card_id = $2",
          [loan_amount * -1, card_id]
        );

        // add money to borrowers account
        await client.query(
          "update cards set total_balance = total_balance + $1 where card_id = $2",
          [loan_amount, borrower_card_id]
        );

        // add money to borrowers global money
        await client.query(
          "update clients set clients_total_balance = clients_total_balance + $1 where client_id = $2",
          [loan_amount, user.client_id]
        );

        // remove money to lender global money
        await client.query(
          "update clients set clients_total_balance = clients_total_balance + $1 where client_id = $2",
          [loan_amount * -1, lender_id]
        );

        // committing changes
        await client.query("commit");

        res.status(200).json("loan successful!");
      } else {
        res.status(400).json("You don't have enough balance in your account");
      }
    } catch (error) {
      await client.query("rollback");
      res.status(400).send({
        add_error: "Error while loaning amount..Try again later."
      });
    } finally {
      client.release();
    }
  } else {
    res.status(401).json("unauthorized");
  }
};
