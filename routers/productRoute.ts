import express from "express";
import { dbClient } from "../server";
import { uploadMiddleWare } from '../middleware'

export const productRoute = express.Router();

productRoute.post("/",uploadMiddleWare, addProduct);

async function addProduct(req: express.Request, res: express.Response) {

  console.log('req.form.fields: ', req.form.fields)
  console.log('req.form: ', req.form)
  
  const productname = req.form.fields.productname;
  const price = Number(req.form.fields.price);
  const gameplatform = req.form.fields.gameplatform;
  const gametype = req.form.fields.gametype;
  const customFile = req.form.files.customFile['newFilename'];
  const description = req.form.fields.description;
  //control product display 
  const displayProduct = req.form.fields.displayProduct

  const displayBoolean = displayProduct == 'display'? true:false
  console.log(displayBoolean)

  const result = (await dbClient.query(`
  INSERT INTO games 
  (name, price, game_cate, image, console, description, is_valid) 
  VALUES ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING id, name`,
    [productname, price, gametype, customFile, gameplatform, description, displayBoolean])).rows;

  console.log(result)
  res.status(200).json({ message: "ok" });
}

/////////////////////////////////////////////////////////////////////////////
// // old version (without formidable)
// async function addProduct(req: express.Request, res: express.Response) {
//   const productname = req.body.productname;
//   const price = req.body.price;
//   const gameplatform = req.body.gameplatform;
//   const gametype = req.body.gametype;
//   const customFile = req.body.customFile;
//   const description = req.body.description;

//   const result = (await dbClient.query(`
//   INSERT INTO games 
//   (name, price, game_cate, image, console, description, is_valid) 
//   VALUES ($1, $2, $3, $4, $5, $6, $7) 
//   RETURNING id, name`,
//     [productname, price, gametype, customFile, gameplatform, description, false])).rows;

//   console.log(result)
//   res.status(200).json({ message: "ok" });
// }
/////////////////////////////////////////////////////////////////////////////