import express from "express";
import { dbClient } from "../server";
import { uploadMiddleWare } from '../middleware'
import formidable from "formidable";
import {userLoggedInMiddleWare} from "../middleware"
import { checkPassword, hashPassword } from "../hash";

export const userRoute = express.Router();

//login
userRoute.post("/login", login);

  //logout
userRoute.get("/logout", logout);

  userRoute.post("/register", uploadMiddleWare, register);

  //get logged in user info
userRoute.get("/loginUserInfo", userLoggedInMiddleWare, getUserInfo);

async function getUserInfo(req :express.Request, res:express.Response) {
  const userInfo = (
    await dbClient.query(`SELECT * FROM users where users.username = $1;`, [
      req.session.user?.username,
    ])
  ).rows[0];
  res.json(userInfo);
}

  async function register(req :express.Request, res:express.Response){
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
    const userNamesEmails = (
      await dbClient.query(`SELECT username,email FROM users;`)).rows
    for (let userNameEmail of userNamesEmails) {
      if (name == userNameEmail.username) {
        res.status(400).json({ message: "input another username plz" })
        return
      }
      if (email == userNameEmail) {
        res.status(401).json({ message: "input another email plz" })
        return
      }
    }
    console.log(userNamesEmails);

    ////// hash testing
    await dbClient.query(
      /*sql*/ `INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ($1,$2,$3,$4,$5,$6,$7);`,
      [name, hashedPassword, email, icon, address, phoneNum, "false"]
    ); //
      ///////

    const registerId = (
      await dbClient.query(`SELECT * FROM users where users.username = $1;`, [
        name,
      ])
    ).rows[0].id;
    await dbClient.query(
      /*sql*/ `INSERT INTO shopping_cart (user_id) VALUES ($1);`,
      [registerId]
    );
    res.status(200).json({ message: "created success" });
    // }
  }

  async function logout(req:express.Request, res:express.Response){
    if (req.session.user) {
      delete req.session.user;
      res.status(200).json({ message: "delete session success" });
    }
  }

  async function login(req:express.Request, res:express.Response) {
    const { username, password } = req.body;
  
    if (!username || !password) {
      res.status(401).json({ message: 'missing username or password' })
      return
    }
    const user = (
      await dbClient.query(`SELECT * FROM users where users.username=$1`, [
        username,
      ])
    ).rows[0];
    
    //hash password test
    if (await checkPassword(password, user.password)) {
      //admin login test
      if (user.is_admin) {
        req.session.user = { username: user.username, userId: user.id, isAdmin: true };
        res.status(201).json({ message: "admin logged in", username });
        console.log("admin login");
        // console.log(req.session.admin)
        return;
      }
      /////////
      //user
      req.session.user = { username: username, userId: user.id, isAdmin: false };
      res.status(200).json({ message: "login success", username });
      console.log("user login");
      //password error
    } else {
      res.status(500).json({ message: "login failed" });
      return;
    }
  }