CREATE DATABASE bank;

-- users table
CREATE TABLE clients (
  client_id serial PRIMARY KEY,
	name VARCHAR ( 50 ) NOT NULL,
  surname VARCHAR ( 50 ) NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
  clients_total_balance NUMERIC (10, 2) NOT NULL DEFAULT 0,
	created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);

-- account table
CREATE TABLE accounts (
  account_id serial PRIMARY KEY,
  account_no BIGINT NOT NULL,
  bank_name VARCHAR(50) NOT NULL,
  total_balance NUMERIC (10, 2) NOT NULL DEFAULT 0,
  client_id INTEGER NOT NULL,
  FOREIGN KEY (client_id) REFERENCES clients (client_id)
);

-- transaction table
CREATE TABLE transactions(
    transaction_id BIGSERIAL PRIMARY KEY NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    withdraw_amount NUMERIC (10, 2) NULL,
    deposit_amount NUMERIC (10, 2) NULL,
    balance NUMERIC (10, 2) NOT NULL DEFAULT 0,
    account_id BIGINT NOT NULL,
    FOREIGN KEY(account_id) REFERENCES accounts(account_id)
);

-- loans table
CREATE TABLE loans (
  loan_id serial PRIMARY KEY,
  amount BIGINT,
  transaction_date TIMESTAMP NOT NULL,
  FOREIGN KEY (lender) REFERENCES client (client_id),
  FOREIGN KEY (borrower) REFERENCES client (client_id),
  FOREIGN KEY(account_id) REFERENCES accounts(account_id)
);
