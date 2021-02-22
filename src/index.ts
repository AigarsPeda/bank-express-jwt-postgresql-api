import cors from "cors";
import express from "express";
import { createClient } from "./controllers/auth/createClient";
import { loginClient } from "./controllers/auth/loginClient";
import { getClientsCards } from "./controllers/cards/card/getClientsCards";
import { postCard } from "./controllers/cards/card/postCard";
import { getLenders } from "./controllers/cards/loan/getLenders";
import { getLoans } from "./controllers/cards/loan/getLoans";
import { postLoan } from "./controllers/cards/loan/postLoan";
import { updateLoan } from "./controllers/cards/loan/updateLoan";
import { getAllTransactions } from "./controllers/cards/transaction/getAllTransactions";
import { getTransactionsForCard } from "./controllers/cards/transaction/getTransactions";
import { postDeposit } from "./controllers/cards/transaction/postDeposit";
import { postWithdraw } from "./controllers/cards/transaction/postWithdraw";
import { getUser } from "./controllers/user/getUser";
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

// ROUTES WITH AUTHORIZATION NEEDED
app.get("/cards", authMiddleware, getClientsCards);
app.post("/cards", authMiddleware, postCard);
app.post("/deposit/:card_id", authMiddleware, postDeposit);
app.post("/withdraw/:card_id", authMiddleware, postWithdraw);
app.post("/loan/:card_id", authMiddleware, postLoan);
app.put("/loan/:loan_id", authMiddleware, updateLoan);
app.get("/transactions/all_transactions", authMiddleware, getAllTransactions);
app.get("/user", authMiddleware, getUser);
app.get("/lenders", authMiddleware, getLenders);

// ROUTES WITH WITH AUTHORIZATION NEEDED AND POSSIBLE QUERIES
// /transactions/:card_id?start_date=start_date&end_date=end_date
app.get("/transactions/:card_id", authMiddleware, getTransactionsForCard);

// /loans/:borrower_card_id?start_date=start_date&end_date=end_date
app.get("/loans/:card_id", authMiddleware, getLoans);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
