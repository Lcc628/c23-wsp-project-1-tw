import express from "express";
import { dbClient } from "../server";
import { uploadMiddleWare } from '../middleware'
import pg from "pg";

export const productRoute = express.Router();

productRoute.post("/", uploadMiddleWare, addProduct);

// query data
// http://localhost:8080/product?delgame=1
// productRoute.get('/delgame', delGame)

// params data
// http://localhost:8080/product/delgame/1


//delete display games
productRoute.get('/delgame/:gameid', delGame)

productRoute.get('/displayGame/:gameId', displayGame)

//getGames
productRoute.get("/games", async (req, res) => {
  const games = (await dbClient.query(`SELECT * FROM games ORDER BY games.id DESC;`)).rows;
  res.json(games);
});

productRoute.get("/ps4Games", async (req, res) => {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "PS4",
    ])
  ).rows;
  res.json(games);
});

productRoute.get("/switchGames", async (req, res) => {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "SWITCH",
    ])
  ).rows;
  res.json(games);
});

productRoute.get("/pcGames", async (req, res) => {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "PC",
    ])
  ).rows;
  res.json(games);
});

productRoute.get("/xboxGames", async (req, res) => {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "XBOX",
    ])
  ).rows;
  res.json(games);
});

//product cart route

//clearCart
productRoute.get("/clearCart", async (req, res) => {
  const userId = req.session.user?.userId;
  const userShoppingCartID = (
    await dbClient.query(`SELECT id FROM shopping_cart where user_id = $1`, [
      userId,
    ])
  ).rows[0]?.id;
  await dbClient.query(
    `DELETE FROM game_shoppingCart_Map WHERE shopping_cart_id =$1`,
    [userShoppingCartID]
  );
  res.status(200).json({ message: "clear success" });
});

//getCartInfo

productRoute.get("/cartProduct", async (req, res) => {

  const userId = req.session.user?.userId;
  const cartId = (
    await dbClient.query(
      `SELECT * FROM shopping_cart where shopping_cart.user_id = $1;`,
      [userId]
    )
  ).rows[0]?.id;

  const cartProduct = (
    await dbClient.query(
      `SELECT * FROM games join game_shoppingCart_Map on games.id = game_shoppingCart_Map.game_id where shopping_cart_id = $1;`,
      [cartId]
    )
  ).rows;

  res.status(200).json(cartProduct);
});

productRoute.get("/getCartInfo", async (req, res) => {
  const userId = req.session.user?.userId;
  const cartId = (
    await dbClient.query(
      `SELECT * FROM shopping_cart where shopping_cart.user_id = $1;`,
      [userId]
    )
  ).rows[0].id;
  const games = (
    await dbClient.query(
      `SELECT * FROM games join game_shoppingCart_Map on games.id = game_shoppingCart_Map.game_id where shopping_cart_id = $1;`,
      [cartId]
    )
  ).rows;
  res.status(200).json(games);
});

//addToCart
productRoute.get("/games/:gid", async (req, res) => {
  const gameId = parseInt(req.params.gid);
  const userId = req.session.user?.userId;
  console.log("/games/:gid, >> gameUd, userId", gameId, userId);

  const cartId = (
    await dbClient.query(
      `SELECT * FROM shopping_cart where shopping_cart.user_id = $1;`,
      [userId]
    )
  ).rows[0]?.id;

  await dbClient.query(
    /*sql*/ `INSERT INTO game_shoppingCart_Map (game_id,shopping_cart_id) VALUES ($1,$2);`,
    [gameId, cartId]
  );

  const gamesAdded = (
    await dbClient.query(
      `SELECT * FROM games join game_shoppingCart_Map on games.id = game_shoppingCart_Map.game_id where shopping_cart_id = $1;`,
      [cartId]
    )
  ).rows;

  res.status(200).json(gamesAdded);
});

//transaction route
productRoute.post("/transactionDetail", async (req, res) => {

// testing 
const userInfo = req.body;
  console.log("Req.body ",req.body);

  const userId = req.session.user?.userId;

  const pool = new pg.Pool({
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  (async () => {
    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const cartId = (
        await dbClient.query(
          `SELECT * FROM shopping_cart where shopping_cart.user_id = $1;`,
          [userId]
        )
      ).rows[0]?.id;

      const games = (
        await dbClient.query(
          `SELECT * FROM games join game_shoppingCart_Map on games.id = game_shoppingCart_Map.game_id where shopping_cart_id = $1;`,
          [cartId]
        )
      ).rows;
      console.log(games);

      const totalAmount = games.reduce(
        (pre, cur) => pre + parseInt(cur.price),
        0
      );

      const transaction = await dbClient.query(
        `INSERT INTO transaction (user_id, total_amount, address, email) VALUES ($1,$2,$3,$4) RETURNING id;`,
        [userId, totalAmount, userInfo.address, userInfo.email]
      );

      games.map(
        async (game) =>
          await dbClient.query(
            `INSERT INTO transaction_detail (transaction_id, game_id, price, quanity) VALUES ($1,$2,$3,$4);`,
            [transaction.rows[0].id, game.game_id, game.price, 1]
          )
      );

      const deletedRecord = (
        await dbClient.query(
          `DELETE FROM shopping_cart WHERE shopping_cart.user_id = $1 RETURNING * ;`,
          [userId]
        )
      )?.rows;

      console.log(deletedRecord);
      await dbClient.query(
        /*sql*/ `INSERT INTO shopping_cart (user_id) VALUES ($1);`,
        [userId]
      );

      await client.query("COMMIT");
      const transactionRecord = (
        await dbClient.query(
          "SELECT * FROM transaction JOIN transaction_detail ON transaction.id = transaction_detail.transaction_id WHERE transaction.user_id = $1 AND transaction_detail.transaction_id = $2;",
          [userId, transaction.rows[0].id]
        )
      ).rows;

      res.status(200).json({ transactionRecord });
    } catch (e) {
      await client.query("ROLLBACK");
      res.status(500).json({ error: "internal server error" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
});


async function displayGame(req: express.Request, res: express.Response) {

  // 拎 params data
  const gameId = req.params.gameId

  // 做野 db sql logic
  try {
    const queryResult = (await dbClient.query('UPDATE games SET is_valid = true WHERE id = $1 RETURNING id', [gameId])).rows
    console.log('displayedGame: ', queryResult)
    // 覆 user
    res.status(200).json({ message: 'displayed' })
    return
  } catch (e) {
    console.log('[ERROR]: ', e)
    res.status(500).json({ message: 'internal server error' })
    return
  }

}

async function delGame(req: express.Request, res: express.Response) {
  // 拎 query data
  // const gameId = req.query.gameid

  // 拎 params data
  const gameId = req.params.gameid

  // 做野 db sql logic
  try {
    const queryResult = (await dbClient.query('UPDATE games SET is_valid = false WHERE id = $1 RETURNING id', [gameId])).rows
    console.log('queryresult: ', queryResult)
    // 覆 user
    res.status(200).json({ message: 'ok' })
    return
  } catch (e) {
    console.log('[ERROR]: ', e)
    res.status(500).json({ message: 'internal server error' })
    return
  }

}

async function addProduct(req: express.Request, res: express.Response) {

  const productname = req.form.fields.productname;
  const price = Number(req.form.fields.price);
  const gameplatform = req.form.fields.gameplatform;
  const gametype = req.form.fields.gametype;
  const customFile = req.form.files.customFile['newFilename'];
  const description = req.form.fields.description;
  //control product display 
  const displayProduct = req.form.fields.displayProduct

  const displayBoolean = displayProduct == 'Display' ? true : false

  if(isNaN(price)){
    console.log("price is not number")
    res.status(400).json({message:"price is not number"})
    return
  }

  const result = (await dbClient.query(`
  INSERT INTO games 
  (name, price, game_cate, image, console, description, is_valid) 
  VALUES ($1, $2, $3, $4, $5, $6, $7) 
  RETURNING id, name`,
    [productname, price, gametype, customFile, gameplatform, description, displayBoolean])).rows;

  console.log("uploaded product",result)
  res.status(200).json({ message: "ok" });
}