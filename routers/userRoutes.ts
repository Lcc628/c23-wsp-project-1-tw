import express from "express";
import { dbClient } from "../server";
import { uploadMiddleWare, userLoggedInMiddleWare } from "../middleware";
import formidable from "formidable";
import { checkPassword, hashPassword } from "../hash";

export const userRoute = express.Router();

//login
userRoute.post("/login", login);

//logout
userRoute.get("/logout", logout);

userRoute.post("/register", uploadMiddleWare, register);

//get logged in user info
userRoute.get("/loginUserInfo", userLoggedInMiddleWare, getUserInfo);

async function getUserInfo(req: express.Request, res: express.Response) {
  const userInfo = (
    await dbClient.query(`SELECT * FROM users where users.username = $1;`, [
      req.session.user?.username,
    ])
  ).rows[0];
  res.json(userInfo);
}

async function register(req: express.Request, res: express.Response) {
  const info = req.form.fields;
  const name = info.username;
  //hash testing
  const password = info.password as string;

  const hashedPassword = await hashPassword(password);
  const email = info.email;
  //

  const address = info.address;
  const phoneNum = info.phoneNum;
  const icon = (req.form.files["icon"] as formidable.File)?.newFilename;

  //error handling
  const duplicatedQueryResult = await dbClient.query(
    /*SQL*/ `SELECT username, email FROM users WHERE username = $1 OR email = $2`,
    [name, email]
  );
  if (duplicatedQueryResult.rowCount > 0) {
    res.status(400).json({ message: "duplicated username or email" });
    return;
  }

  const insertedQueryResult = await dbClient.query(
    /*sql*/ `INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id;`,
    [name, hashedPassword, email, icon, address, phoneNum, "false"]
  );
  const registerId = insertedQueryResult.rows[0].id;

  await dbClient.query(
    /*sql*/ `INSERT INTO shopping_cart (user_id) VALUES ($1);`,
    [registerId]
  );
  res.status(200).json({ message: "created success" });
}

async function logout(req: express.Request, res: express.Response) {
  delete req.session.user;
  res.status(200).json({ message: "delete session success" });
}

async function login(req: express.Request, res: express.Response) {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(401).json({ message: "missing username or password" });
    return;
  }
  const user = (
    await dbClient.query(`SELECT * FROM users where users.username = $1`, [
      username,
    ])
  ).rows[0];

  if (user && (await checkPassword(password, user.password))) {
    req.session.user = {
      username: username,
      userId: user.id,
      isAdmin: user.is_admin,
    };
    res.status(200).json({ message: "login success", username });
  } else {
    res.status(500).json({ message: "login failed" });
  }
}
