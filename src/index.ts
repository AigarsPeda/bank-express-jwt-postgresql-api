import cors from "cors";
import express from "express";
import { createClientsCards } from "./controllers/account/createClientsCards";
import { deposit } from "./controllers/account/deposit";
import { getClientsCards } from "./controllers/account/getClientsCards";
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
app.get("/cards", authMiddleware, getClientsCards);
app.post("/cards", authMiddleware, createClientsCards);
app.post("/deposit/:card_id", authMiddleware, deposit);
app.post("/withdraw/:card_id", authMiddleware, withdraw);
app.post("/loan/:card_id", authMiddleware, loan);

// transfers
// transactions
//

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
