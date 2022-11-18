import express from "express";
import expressSession from "express-session";
import pg from "pg";
import dotenv from "dotenv";
import { adminLoggedInMiddleWare, userLoggedInMiddleWare } from "./middleware";
import fs from "fs";

//////////////////////////// setup ////////////////////////////
const app = express();
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uploadDir = "uploads";
fs.mkdirSync(uploadDir, { recursive: true });

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
  })
);

declare module "express-session" {
  interface SessionData {
    user: {
      username: string;
      userId: number;
      isAdmin: boolean
    }
  }
}

//////////////////////////// routes ////////////////////////////
//product routes
import { productRoute } from "./routers/productRoute";
app.use("/product", productRoute);

//user routes
import { userRoute } from "./routers/userRoutes";
app.use("/user", userRoute);

//////////////////////////// statics ////////////////////////////

app.use(express.static("public"));
app.use(express.static("uploads"));
app.use(express.static("gameImage"));
app.use(userLoggedInMiddleWare, express.static("private"));
app.use(adminLoggedInMiddleWare, express.static("adminPrivate"));

app.use("/", (req, res) => {
  res.redirect("/404.html");
});

//////////////////////////// listening port ////////////////////////////

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
