import { Response } from "express";
import { getClient, poll } from "../../../db";
import { RequestWithUser } from "../../../types";

export const updateLoan = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const client = await getClient();
    if (!client) return res.status(503).json("no connection with db");

    const { user } = req.user;
    const { loan_id } = req.params;
    const { loan_repayment_amount } = req.body;

    // check if amount is positive number
    if (loan_repayment_amount <= 0) res.status(400).json("bad request");

    const result = await poll.query(
      "SELECT borrower_card_id, loan_amount, lender_card_id FROM loans WHERE loan_id = $1",
      [parseInt(loan_id)]
    );

    const borrower_card_id = +result.rows[0].borrower_card_id;
    const loan_amount = +result.rows[0].loan_amount;
    const lender_card_id = +result.rows[0].lender_card_id;

    // find cards loan owner in cards table
    const owner = await poll.query(
      "SELECT card_no FROM cards WHERE card_id = $1 AND client_id = $2",
      [borrower_card_id, user.client_id]
    );

    const lender = await poll.query(
      "SELECT client_id FROM cards WHERE card_id = $1",
      [lender_card_id]
    );

    const lender_id = +lender.rows[0].client_id;

    if (owner.rows.length) {
      if (loan_repayment_amount > loan_amount) {
        res
          .status(200)
          .json(
            `your deposit amount is ${
              (loan_amount - loan_repayment_amount) * -1
            } EUR too big `
          );
      }

      const remaining_loan_amount = loan_amount - loan_repayment_amount;
      const is_paid = remaining_loan_amount === 0 ? true : false;
      const loan_returned_date = remaining_loan_amount === 0 ? true : false;

      try {
        await client.query("begin");

        // update loans entry
        await client.query(
          `UPDATE loans 
           SET remaining_loan_amount = $1, is_paid = $2, loan_returned_date = $3 
           WHERE borrower_card_id = $4 AND loan_id = $5 
          `,
          [
            remaining_loan_amount,
            is_paid,
            loan_returned_date,
            borrower_card_id,
            loan_id
          ]
        );

        // add money from lender account
        await client.query(
          "update cards set total_balance = total_balance + $1 where card_id = $2",
          [loan_repayment_amount, lender_card_id]
        );

        // remove money from borrower account
        await client.query(
          "update cards set total_balance = total_balance + $1 where card_id = $2",
          [loan_repayment_amount * -1, borrower_card_id]
        );

        // add money to lender global money
        await client.query(
          "update clients set clients_total_balance = clients_total_balance + $1 where client_id = $2",
          [loan_repayment_amount, lender_id]
        );

        // remove money to borrowers global money
        await client.query(
          "update clients set clients_total_balance = clients_total_balance + $1 where client_id = $2",
          [loan_repayment_amount * -1, user.client_id]
        );

        await client.query("commit");

        res.status(200).json("loan successful updated!");
      } catch (error) {
        await client.query("rollback");
        res.status(400).send({
          add_error: "Error while updating loan... Try again later."
        });
      } finally {
        client.release();
      }
    } else {
      res.status(401).json("unauthorized");
    }
  }
};
