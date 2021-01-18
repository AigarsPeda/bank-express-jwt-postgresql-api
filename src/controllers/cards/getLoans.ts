import { Response } from "express";
import { QueryResult } from "pg";
import { poll } from "../../db";
import { RequestWithUser } from "../../types";

export const getLoans = async (req: RequestWithUser, res: Response) => {
  if (req.user) {
    const { user } = req.user;
    const { card_id } = req.params;
    const { start_date, end_date } = req.query;

    // check who owns this card
    // there are two owners lender and borrower
    const owner = await poll.query(
      "select card_id from cards where card_id = $1 AND client_id = $2",
      [parseInt(card_id), user.client_id]
    );

    if (owner.rows.length) {
      // you are owner and can see results
      let result: QueryResult<any>;

      try {
        if (start_date && end_date) {
          // this information can be accessed by two people
          // borrower or
          // lender
          result = await poll.query(
            `select to_char(loan_taken_date, 'DD-MM-YYYY') 
             as formatted_date, loan_amount, is_paid, lender_card_id, remaining_loan_amount, loan_id  
             from loans where 
             borrower_card_id = $1 
             OR
             lender_card_id = $1
             and to_char(loan_taken_date, 'DD-MM-YYYY') 
             between $2 and $3 order by loan_taken_date desc
            `,
            [card_id, start_date, end_date]
          );
        } else {
          result = await poll.query(
            `select to_char(loan_taken_date, 'DD-MM-YYYY') 
             as formatted_date, loan_amount, is_paid, lender_card_id, remaining_loan_amount  
             from loans where 
             borrower_card_id = $1
             OR
             lender_card_id = $1
             order by loan_taken_date desc
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
