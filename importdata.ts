import pg from "pg";
import dotenv from "dotenv";
import { hashPassword } from "./hash";

dotenv.config();

async function main() {
  const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await client.connect();
  console.log("db connected !!!");

  await client.query(
    /*sql*/ `INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
    [
      "admin",
      await hashPassword("881229"),
      "hi@gmail.com",
      "test.jpg",
      "hk",
      "123456",
      "true",
    ]
  );

  await client.query(
    /*sql*/ `INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
    [
      "chung",
      await hashPassword("881229"),
      "hi11@gmail.com",
      "test.jpg",
      "hk",
      "123456",
      "false",
    ]
  );

  await client.query(
    /*sql*/ `INSERT INTO shopping_cart (user_id) VALUES ($1);`,
    ["1"]
  );

  await client.query(
    /*sql*/ `INSERT INTO shopping_cart (user_id) VALUES ($1);`,
    ["2"]
  );

  const result = await client.query(`SELECT * FROM users`);
  console.log(result.rows);

  await client.end();
  console.log("db connection end !!!");
}

main();
