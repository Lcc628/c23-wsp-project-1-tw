import express from "express"
import expressSession from "express-session"
import pg from "pg";
import dotenv from "dotenv";
import { userLoggedInMiddleWare } from "./middleware";
import fs from "fs"
import { uploadMiddleWare } from "./middleware";
import formidable from "formidable";
// import path from "path";

const app = express();
dotenv.config();
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const uploadDir = 'uploads'
fs.mkdirSync(uploadDir, { recursive: true })

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
    user: {username:string}
  }
}


//user routes
//login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  const user = (await dbClient.query(`SELECT * FROM users where users.username=$1`, [username])).rows[0]
  if (user?.password == password) {
    req.session.user = {username:username}
    res.status(200).json({ message: 'login success',username})
  } else{
    res.status(500).json({message:'login failed'})
    return
  }
})

//register path
app.post('/register',uploadMiddleWare, async (req, res) => {
  const info = req.form.fields
  const name = info.username;
  const password = info.password;
  const email = info.email;
  const address = info.address;
  const phoneNum = info.phoneNum;
  const icon = (req.form.files["icon"] as formidable.File)?.newFilename 
    await dbClient.query(/*sql*/`INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7);`,[name,password,email,icon,address,phoneNum,'false'])
    res.status(200).json({message:"created success"})
  // }
})



//games routes

//homepage show game(image,price,name)
app.get('/games',async(req,res)=>{
  const games = (await dbClient.query(`SELECT name,price,image,console,is_valid FROM games;`)).rows
  res.json(games)
  console.log(games)
})

app.get('/ps4Games',async(req,res)=>{
  const games = (await dbClient.query(`SELECT name,price,image,console,is_valid FROM games where games.console = $1;`,['PS4'])).rows
  res.json(games)
  console.log(games)
})

app.get('/switchGames',async(req,res)=>{
  const games = (await dbClient.query(`SELECT name,price,image,console,is_valid FROM games where games.console = $1;`,['SWITCH'])).rows
  res.json(games)
  console.log(games)
})

app.get('/pcGames',async(req,res)=>{
  const games = (await dbClient.query(`SELECT name,price,image,console,is_valid FROM games where games.console = $1;`,['PC'])).rows
  res.json(games)
  console.log(games)
})

app.get('/xboxGames',async(req,res)=>{
  const games = (await dbClient.query(`SELECT name,price,image,console,is_valid FROM games where games.console = $1;`,['XBOX'])).rows
  res.json(games)
  console.log(games)
})

app.use(express.static("public"))
app.use(express.static("uploads"));
app.use(userLoggedInMiddleWare,express.static("private"))

app.use('/', (req, res) => {
  res.redirect('/404.html')
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})