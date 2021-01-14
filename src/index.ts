import cors from "cors";
import express from "express";
import { createClientsAccount } from "./controllers/account/createClientsAccount";
import { deposit } from "./controllers/account/deposit";
import { getClientsAccounts } from "./controllers/account/getClientsAccounts";
import { loan } from "./controllers/account/loan";
import { withdraw } from "./controllers/account/withdraw";
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
app.get("/account", authMiddleware, getClientsAccounts);
app.post("/account", authMiddleware, createClientsAccount);
app.post("/deposit/:account_id", authMiddleware, deposit);
app.post("/withdraw/:account_id", authMiddleware, withdraw);
app.post("/loan/:account_id", authMiddleware, loan);

// transfers
// transactions
//

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
