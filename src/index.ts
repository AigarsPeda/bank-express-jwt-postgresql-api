import express from "express";
import cors from "cors";
import { poll } from "./db";

const PORT = 8000;

const app = express();

// MIDDLEWARE //
app.use(cors());
app.use(express.json()); // req.body

// ROUTES //
app.get("/", async (req, res) => {
  // try {
  //   const { description } = req.body;
  //   const newTodo = await poll.query(
  //     "INSERT INTO todo (description) VALUES($1) RETURNING *",
  //     [description]
  //   );
  //   res.json(newTodo.rows[0]);
  // } catch (error) {
  //   console.error(error.message);
  // }
  res.status(400).json("Hello World!");
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
