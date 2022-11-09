DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username varchar(255) not null,
    password varchar(255) not null
);