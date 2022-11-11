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

  
await client.query(/*sql*/`INSERT INTO users (username,password,email,icon,address,phone_number,is_admin,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9);`,['chung','881229','hi@gmail.com','test.jpg','hk','123456','false'])
const result = await client.query(`SELECT * FROM users`)
console.log(result.rows)

  await client.end();
  console.log("db connection end !!!");
}

main();
