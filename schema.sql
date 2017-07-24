CREATE TABLE albums (
  id SERIAL,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

CREATE TABLE account (
  user_id SERIAL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL
);
