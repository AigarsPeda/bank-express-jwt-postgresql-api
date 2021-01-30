import argon2 from "argon2";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { poll } from "../../db";
import {
  validateEmail,
  validatePassword,
  validSignupUser
} from "../../utils/validUser";

export const createClient = async (req: Request, res: Response) => {
  try {
    const { email, password, name, surname } = req.body;
    const created_on = new Date();

    // validating name and surname
    if (!validSignupUser(name, surname)) {
      return res.status(400).json({ error: "provide valid name / surname" });
    }

    // validating email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "provide valid email" });
    }

    // validating password
    if (!validatePassword(password)) {
      return res.status(400).json({ error: "provide valid password" });
    }

    // hash password
    const hashPassword = await argon2.hash(password);

    // saving user to db and returning new user
    // without password to return it later
    // with response
    const newUser = await poll.query(
      ` INSERT INTO clients (name, surname, email, password, created_on, last_login) 
        VALUES($1, $2, $3, $4, $5, $5) 
        RETURNING name, surname, email, created_on, client_id, clients_total_balance
      `,
      [
        name.toLowerCase(),
        surname.toLowerCase(),
        email.toLowerCase(),
        hashPassword,
        created_on
      ]
    );

    // sign jsonwebtoken to save it in front
    // and identify user later
    const token = jwt.sign({ user: newUser.rows[0] }, process.env.SECRET_KEY!);

    // returning user and token
    return res.status(200).json({
      user: newUser.rows[0],
      token: token
    });
  } catch (error) {
    console.error("SIGNUP ERROR: ", error.message);
    return res.json({ error: "user name or email already taken" });
  }
};
