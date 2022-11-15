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
app.use(express.urlencoded({ extended: true }));
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
    secret: Math.random().toString(32).slice(2),
    resave: true,
    saveUninitialized: true,
  }),
)

declare module 'express-session' {
  interface SessionData {
    user: {
      username: string,
      userId: number
    }
  }
}


//user routes
//login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = (await dbClient.query(`SELECT * FROM users where users.username=$1`, [username])).rows[0]

  if (user?.password == password) {
    req.session.user = { username: username, userId: user.id }
    res.status(200).json({ message: 'login success', username })
  } else {
    res.status(500).json({ message: 'login failed' })
    return
  }
})

//logout
app.get('/logout',async (req, res) => {
  console.log(req.session.user)
  if(req.session.user){
    delete req.session.user;
    res.status(200).json({message:"delete session success"})
  }
})


//register path
app.post('/register', uploadMiddleWare, async (req, res) => {
  const info = req.form.fields
  const name = info.username;
  const password = info.password;
  const email = info.email;
  const address = info.address;
  const phoneNum = info.phoneNum;
  const icon = (req.form.files["icon"] as formidable.File)?.newFilename
  await dbClient.query(/*sql*/`INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7);`, [name,password, email, icon, address, phoneNum, 'false']) // 
  const registerId = (await dbClient.query(`SELECT * FROM users where users.username = $1;`, [name])).rows[0].id
  console.log("registerId: ", registerId)
  await dbClient.query(/*sql*/`INSERT INTO shopping_cart (user_id) VALUES ($1);`, [registerId])
  res.status(200).json({ message: "created success" })
  // }
})

//get logged in user info
app.get('/loginUserInfo', userLoggedInMiddleWare, async (req, res) => {
  const userInfo = (await dbClient.query(`SELECT * FROM users where users.username = $1;`, [req.session.user?.username])).rows[0] 
  console.log("req.session.user: ", req.session.user)
  res.json(userInfo)
})




//games routes

//addToCart
app.get("/games/:gid", async (req, res) => {
  const gameId = parseInt(req.params.gid)
  const userId = req.session.user?.userId;
  const cartId = (await dbClient.query(`SELECT * FROM shopping_cart where shopping_cart.user_id = $1;`, [userId])).rows[0].id

  await dbClient.query(/*sql*/`INSERT INTO game_shoppingCart_Map (game_id,shopping_cart_id) VALUES ($1,$2);`, [gameId, cartId])

  const gamesAdded = (await dbClient.query(`SELECT * FROM games join game_shoppingCart_Map on games.id = game_shoppingCart_Map.game_id`)).rows

  console.log(gamesAdded)

  res.status(200).json(gamesAdded)

});

//clearCart
app.get('/clearCart',async(req,res)=>{
  const userId = req.session.user?.userId;
  const userShoppingCartID = (await dbClient.query(`SELECT id FROM shopping_cart where user_id = $1`,[userId])).rows[0].id
  console.log(userShoppingCartID)
  await dbClient.query(`DELETE FROM game_shoppingCart_Map WHERE shopping_cart_id =$1`,[userShoppingCartID])
  res.status(200).json({message:"clear success"})

})

//Admin Post Rounte//
// app.post("/upformPhoto",async(req,res)=>{
//   form.parse(req, (err, fields, files) => {
//     console.log({ err, fields, files });
//     res.json(message:" Admin Post");
//   });
// })





//homepage show game(image,price,name)
app.get('/games', async (req, res) => {
  const games = (await dbClient.query(`SELECT * FROM games;`)).rows
  res.json(games)
})

app.get('/ps4Games', async (req, res) => {
  const games = (await dbClient.query(`SELECT * FROM games where games.console = $1;`, ['PS4'])).rows
  res.json(games)
})

app.get('/switchGames', async (req, res) => {
  const games = (await dbClient.query(`SELECT * FROM games where games.console = $1;`, ['SWITCH'])).rows
  res.json(games)
})

app.get('/pcGames', async (req, res) => {
  const games = (await dbClient.query(`SELECT * FROM games where games.console = $1;`, ['PC'])).rows
  res.json(games)
})

app.get('/xboxGames', async (req, res) => {
  const games = (await dbClient.query(`SELECT * FROM games where games.console = $1;`, ['XBOX'])).rows
  res.json(games)
})

app.use(express.static("public"))
app.use(express.static("uploads"));
app.use(userLoggedInMiddleWare, express.static("private"))

app.use('/', (req, res) => {
  res.redirect('/404.html')
})

const PORT = 8080

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`)
})