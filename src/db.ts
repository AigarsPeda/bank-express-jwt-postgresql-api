import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const Poll = pg.Pool;

// if there are user with password you should add it here
export const poll = new Poll({
  host: process.env.HOST,
  port: parseInt(process.env.DB_PORT!),
  database: process.env.DATABASE,
  user: process.env.USER,
  password: process.env.PASSWORD
});

export const getClient = async () => {
  try {
    const client = await poll.connect();
    return client;
  } catch (error) {
    return null;
  }
};
