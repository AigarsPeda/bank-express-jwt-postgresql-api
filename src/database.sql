CREATE DATABASE bank;

-- users table
CREATE TABLE clients (
  client_id serial PRIMARY KEY,
	name VARCHAR ( 50 ) NOT NULL,
  surname VARCHAR ( 50 ) NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);

-- account table
CREATE TABLE accounts (
  id serial PRIMARY KEY,
  CONSTRAINT account_owner FOREIGN KEY (client_id) REFERENCES client (client_id),
  total_balance BIGINT NOT NULL DEFAULT 0
);

-- transaction table
CREATE TABLE transactions (
  id serial PRIMARY KEY,
  FOREIGN KEY (lender) REFERENCES client (client_id),
  FOREIGN KEY (borrower) REFERENCES client (client_id),
  amount INTEGER,
  transaction_date TIMESTAMP NOT NULL,
);

-- CONSTRAINT account_owner FOREIGN KEY (client_id) REFERENCES client (client_id),
-- FOREIGN KEY (addid) REFERENCES Table1_Addr(addid),
-- FOREIGN KEY (id) REFERENCES Table1(id)

-- CREATE TABLE account(
--     account_id BIGSERIAL PRIMARY KEY NOT NULL,
--     account_no BIGINT NOT NULL,
--     bank_name VARCHAR(50) NOT NULL,
--     ifsc VARCHAR(32) NOT NULL,
--     userid INTEGER NOT NULL,
--     total_balance BIGINT NOT NULL DEFAULT 0,
--     FOREIGN KEY(userid) REFERENCES bank_user(userid)
-- );

-- CREATE TABLE transactions(
--     tr_id BIGSERIAL PRIMARY KEY NOT NULL,
--     transaction_date TIMESTAMP NOT NULL,
--     withdraw_amount DECIMAL NULL,
--     deposit_amount DECIMAL NULL,
--     balance DECIMAL NOT NULL DEFAULT 0,
--     account_id BIGINT NOT NULL,
--     FOREIGN KEY(account_id) REFERENCES account(account_id)
-- );