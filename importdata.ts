import pg from "pg";
import dotenv from "dotenv";
// import { hashPassword } from "./hash";
dotenv.config();

async function main() {
  const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  await client.connect();
  console.log("db connected !!!");

  
await client.query(/*sql*/`INSERT INTO users (username,password) VALUES ($1,$2),($3,$4);`,['lam@gmail.com','881229','hi@gmail.com','881229'])
const result = await client.query(`SELECT * FROM users`)
console.log(result.rows)

  await client.end();
  console.log("db connection end !!!");
}

main();
