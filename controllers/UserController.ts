import { UserService } from "../services/UserService";
import express from "express";
import { checkPassword } from "../hash";

export class UserController {
  constructor(private userService: UserService) {}

  login = async (req: express.Request, res: express.Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).json({ message: "missing username or password" });
      return;
    }
    const user = await this.userService.getUserByUsername(username);
    // const user = (
    //   await dbClient.query(`SELECT * FROM users where users.username=$1`, [
    //     username,
    //   ])
    // ).rows[0];

    //hash password test
    if (await checkPassword(password, user.password)) {
      //admin login test
      if (user.is_admin) {
        req.session.user = {
          username: user.username,
          userId: user.id,
          isAdmin: true,
        };
        res.status(201).json({ message: "admin logged in", username });
        console.log("admin login");
        return;
      }
      /////////
      //user
      req.session.user = {
        username: username,
        userId: user.id,
        isAdmin: false,
      };
      res.status(200).json({ message: "login success", username });
      console.log("user login");
      //password error
    } else {
      res.status(500).json({ message: "login failed" });
      return;
    }
  };
}
