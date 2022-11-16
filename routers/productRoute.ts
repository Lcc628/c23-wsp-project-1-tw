import express from "express";
import { dbClient } from "../server";

export const productRoute = express.Router();

productRoute.post("/", async (req, res) => {
  const productname = req.body.productname;
  const price = req.body.price;
  const gameplatform = req.body.gameplatform;
  const gametype = req.body.gametype;
  const customFile = req.body.customFile;
  const description = req.body.description;

  const result = (await dbClient.query(`
  INSERT INTO games 
  (name, price, game_cate, image, console, description, is_valid) 
  VALUES ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING id, name`, 
  [productname, price, gametype, customFile, gameplatform, description, false])).rows;

  console.log(result)
  res.status(200).json({ message: "ok" });
});
