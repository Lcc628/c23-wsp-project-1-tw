DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username varchar(255) not null,
    password varchar(255) not null,
    email varchar(255),
    icon varchar(255),
    address varchar(255),
    phone_number varchar(255),
    is_admin boolean,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);