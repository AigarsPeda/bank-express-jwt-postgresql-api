import argon2 from "argon2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { poll } from "../../db";
import { validLoginUser } from "../../utils/validUser";

export const loginClient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validating email and password
    if (!validLoginUser(email, password)) {
      return res.status(400).json({ error: "provide valid data" });
    }

    // find user id DB with email
    const loginUser = await poll.query(
      "SELECT *  FROM clients WHERE email = $1",
      [email.toLowerCase()]
    );

    // user not found
    if (!loginUser.rows[0]) {
      return res.status(400).json({ error: "user not found" });
    }

    // check password
    // compare password entered and what is saved in db
    if (await argon2.verify(loginUser.rows[0].password, password)) {
      const last_login = new Date();
      const updatedClient = await poll.query(
        `UPDATE clients SET last_login = $1 WHERE email = $2 
         RETURNING name, surname, email, created_on, last_login, client_id, clients_total_balance
        `,
        [last_login, email.toLowerCase()]
      );

      // sign jsonwebtoken to save it in front
      // end identify user later
      const token = jwt.sign(
        { user: updatedClient.rows[0] },
        process.env.SECRET_KEY!
      );

      // delete password from user so it
      // would not be in response
      // delete loginUser.rows[0].password;

      // return token and found user
      return res.status(200).json({
        user: updatedClient.rows[0],
        token: token
      });
    } else {
      // password did not match
      return res.status(401).json({ error: "wrong credentials" });
    }
  } catch (error) {
    console.error("LOGIN ERROR: ", error.message);
    return res.status(503).json({ error: "service unavailable" });
  }
};
