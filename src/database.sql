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
CREATE TABLE cards (
  card_id serial PRIMARY KEY,
  card_no BIGINT UNIQUE NOT NULL,
  bank_name VARCHAR(50) NOT NULL,
  total_balance NUMERIC (10, 2) NOT NULL DEFAULT 0,
  client_id INTEGER NOT NULL,
  lender BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (client_id) REFERENCES clients (client_id)
);

-- transaction table
CREATE TABLE transactions(
    transaction_id BIGSERIAL PRIMARY KEY NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    withdraw_amount NUMERIC (10, 2) NULL,
    deposit_amount NUMERIC (10, 2) NULL,
    deposit_description VARCHAR(255),
    withdraw_description VARCHAR(255),
    balance NUMERIC (10, 2) NOT NULL DEFAULT 0,
    card_id BIGINT NOT NULL,
    FOREIGN KEY(card_id) REFERENCES cards(card_id)
);

-- loans table
CREATE TABLE loans (
  loan_id serial PRIMARY KEY,
  loan_amount NUMERIC (10, 2) NULL,
  return_amount NUMERIC (10, 2) NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  loan_taken_date TIMESTAMP NOT NULL,
  loan_returned_date TIMESTAMP NULL,
  lender_card_id BIGINT NOT NULL,
  remaining_loan_amount NUMERIC (10, 2) NULL,
  FOREIGN KEY(lender_card_id) REFERENCES cards(card_id),
  borrower_card_id BIGINT NOT NULL,
  FOREIGN KEY(borrower_card_id) REFERENCES cards(card_id)
);

ALTER TABLE loans
RENAME COLUMN retun_amount TO return_amount;

ALTER TABLE accounts
ADD lender BOOLEAN DEFAULT FALSE;

ALTER TABLE loans
ADD retun_amount NUMERIC (10, 2) NULL;

ALTER TABLE loans
ADD is_paid BOOLEAN DEFAULT FALSE;

ALTER TABLE loans
ADD loan_returned TIMESTAMP NULL;

ALTER TABLE loans
ADD reamining_loan_amount NUMERIC (10, 2) NULL;

alter table transactions add withdraw_description varchar(255);
