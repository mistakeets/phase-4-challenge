CREATE TABLE albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  date_joined DATE NOT NULL
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  review VARCHAR(2000) NOT NULL,
  review_date DATE NOT NULL,
  author_id INTEGER REFERENCES users(id),
  album_id INTEGER REFERENCES albums(id)
)
