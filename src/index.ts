import express from "express";
import cors from "cors";
import { poll } from "./db";
import { validSignupUser } from "./utils/validUser";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const PORT = 8000;

const app = express();

// MIDDLEWARE //
app.use(cors());
app.use(express.json()); // req.body

// ROUTES //
app.get("/", async (req, res) => {
  res.status(400).json("Hello World!");
});

// create user
app.post("/signup", async (req, res) => {
  try {
    const created_on = new Date();
    const { email, password, name, surname } = req.body;

    // validating email, password and user name
    if (!validSignupUser(email, password, name, surname)) {
      return res.status(400).json({ error: "provide valid data" });
    }

    // hash password
    const hashPassword = await argon2.hash(password);

    const newUser = await poll.query(
      ` INSERT INTO client (name, surname, email, password, created_on) 
        VALUES($1, $2, $3, $4, $5) 
        RETURNING name, surname, email, created_on, last_login, client_id
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
    // end identify user later
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
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
