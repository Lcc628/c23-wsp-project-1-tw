import express from "express"
import expressSession from "express-session"
import { Request, Response } from 'express'
import pg from "pg";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(express.json());

export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});
dbClient.connect();

app.use(
  expressSession({
    secret: 'Tecky Academy teaches typescript',
    resave: true,
    saveUninitialized: true,
  }),
)

declare module 'express-session' {
  interface SessionData {
    user:{}
  }
}

app.use(express.static("./public"))

app.post('/login',async (req,res)=>{
  const {username,password} = req.body;

  const user = (await dbClient.query(`SELECT * FROM users where users.username=$1`,[username])).rows[0]
  if(user?.password == password){
    return res.status(200).json('correct password')
  }else{
    return res.status(500).json('invalid password')
  }
})

app.get('/', function (req: Request, res: Response) {
  res.redirect("/")
})


const PORT = 8080

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})