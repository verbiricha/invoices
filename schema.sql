CREATE EXTENSION "uuid-ossp";

CREATE TABLE invoices (
  -- Metadata
  id serial primary key,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  short_id VARCHAR(32) NOT NULL UNIQUE,
  -- Invoice fields
  user_id uuid NOT NULL,
  invoice_id uuid NOT NULL,
  issuer VARCHAR(200) NOT NULL,
  customer VARCHAR(200) NOT NULL,
  memo VARCHAR(200) NOT NULL,
  due_date DATE NOT NULL,
  -- Amount
  amount TEXT NOT NULL,
  currency VARCHAR(4) NOT NULL
);

CREATE TABLE quotes (
  id SERIAL PRIMARY KEY,
  quote_id UUID NOT NULL,
  invoice_short_id VARCHAR(32) UNIQUE NOT NULL REFERENCES invoices(short_id),
  ln TEXT NOT NULL,
  onchain TEXT,
  amount TEXT,
  expiration TIMESTAMP NOT NULL
);
