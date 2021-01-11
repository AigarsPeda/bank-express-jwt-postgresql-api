CREATE DATABASE bank;




-- users table
CREATE TABLE client (
  client_id serial PRIMARY KEY,
	name VARCHAR ( 50 ) NOT NULL,
  surname VARCHAR ( 50 ) NOT NULL,
	password VARCHAR ( 255 ) NOT NULL,
	email VARCHAR ( 255 ) UNIQUE NOT NULL,
	created_on TIMESTAMP NOT NULL,
  last_login TIMESTAMP
);
