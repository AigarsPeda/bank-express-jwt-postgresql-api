import cors from "cors";
import express from "express";
import { postCard } from "./controllers/cards/postCard";
import { postDeposit } from "./controllers/cards/postDeposit";
import { getClientsCards } from "./controllers/cards/getClientsCards";
import { getTransactions } from "./controllers/cards/getTransactions";
import { postLoan } from "./controllers/cards/postLoan";
import { postWithdraw } from "./controllers/cards/postWithdraw";
import { createClient } from "./controllers/auth/createClient";
import { loginClient } from "./controllers/auth/loginClient";
import { authMiddleware } from "./middleware/authMiddleware";
import { getLoans } from "./controllers/cards/getLoans";

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

// ROUTES WITH AUTHORIZATION NEEDED
app.get("/cards", authMiddleware, getClientsCards);
app.post("/cards", authMiddleware, postCard);
app.post("/deposit/:card_id", authMiddleware, postDeposit);
app.post("/withdraw/:card_id", authMiddleware, postWithdraw);
app.post("/loan/:card_id", authMiddleware, postLoan);

// ROUTES WITH WITH AUTHORIZATION NEEDED AND POSSIBLE QUERIES
// /transactions/:card_id?start_date=start_date&end_date=end_date
app.get("/transactions/:card_id", authMiddleware, getTransactions);
// /loans/:borrower_card_id?start_date=start_date&end_date=end_date
app.get("/loans/:borrower_card_id", authMiddleware, getLoans);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
