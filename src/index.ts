import cors from "cors";
import express from "express";
import { clientsAccount } from "./controllers/account/clientsAccount";
import { createClient } from "./controllers/auth/createClient";
import { loginClient } from "./controllers/auth/loginClient";
import { authMiddleware } from "./middleware/authMiddleware";

const PORT = 8000;

const app = express();

// MIDDLEWARE //
app.use(cors());
app.use(express.json()); // req.body

app.get("/", async (req, res) => {
  res.status(200).json("Hello World!");
});

// AUTH ROUTE
app.post("/signup", createClient);
app.post("/login", loginClient);

// ROUTES WITH AUTHORIZATION
app.get("/account", authMiddleware, clientsAccount);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
