import express from "express";
import { dbClient } from "../server";
import { uploadMiddleWare } from "../middleware";
import pg from "pg";

export const productRoute = express.Router();

productRoute.post("/", uploadMiddleWare, addProduct);

//delete display games
// Method: DELETE
productRoute.get("/delgame/:gameid", delGame);

productRoute.get("/displayGame/:gameId", displayGame);

//getGames
productRoute.get("/games", getGames);
productRoute.get("/ps4Games", getPs4Games);
productRoute.get("/switchGames", getSwitchGames);
productRoute.get("/pcGames", getPcGames);
productRoute.get("/xboxGames", getXboxGames);

productRoute.get("/gamesV2", getGamesV2);

//product cart route

//clearCart
productRoute.get("/clearCart", clearCart);

//getCartInfo

productRoute.get("/cartProduct", getCartProduct);
productRoute.get("/getCartInfo", getCartInfo);

//addToCart
productRoute.get("/games/:gid", addToCart);

//transaction route
productRoute.post("/transactionDetail", getTransactionDetail);

async function getTransactionDetail(
  req: express.Request,
  res: express.Response
) {
  let client: pg.PoolClient | null = null;
  try {
    const userInfo = req.body;
    const userId = req.session.user?.userId;
    const pool = new pg.Pool({
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // note: we don't try/catch this because if connecting throws an exception
    // we don't need to dispose of the client (it will be undefined)
    client = await pool.connect();
    await client.query("BEGIN");

    const cartId = (
      await dbClient.query(
        `SELECT id FROM shopping_cart where shopping_cart.user_id = $1;`,
        [userId]
      )
    ).rows[0]?.id;

    const games = (
      await dbClient.query(
        `SELECT * FROM games join game_shoppingCart_Map on games.id = game_shoppingCart_Map.game_id where shopping_cart_id = $1;`,
        [cartId]
      )
    ).rows;

    const totalAmount = games.reduce(
      (pre, cur) => pre + parseInt(cur.price),
      0
    );

    const transaction = await dbClient.query(
      `INSERT INTO transaction (user_id, total_amount, address, email) VALUES ($1,$2,$3,$4) RETURNING id;`,
      [userId, totalAmount, userInfo.address, userInfo.email]
    );

    games.forEach(
      async (game) =>
        await dbClient.query(
          `INSERT INTO transaction_detail (transaction_id, game_id, price, quanity) VALUES ($1,$2,$3,$4);`,
          [transaction.rows[0].id, game.game_id, game.price, 1]
        )
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
    if (client) {
      await client.query("ROLLBACK");
    }
    res.status(500).json({ error: "internal server error" });
  } finally {
    if (client) {
      client.release();
    }
  }
}

async function addToCart(req: express.Request, res: express.Response) {
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
}

async function getCartInfo(req: express.Request, res: express.Response) {
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
}

async function getCartProduct(req: express.Request, res: express.Response) {
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
}

async function clearCart(req: express.Request, res: express.Response) {
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
}

async function getXboxGames(req: express.Request, res: express.Response) {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "XBOX",
    ])
  ).rows;
  res.json(games);
}

async function getPcGames(req: express.Request, res: express.Response) {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "PC",
    ])
  ).rows;
  res.json(games);
}

async function getSwitchGames(req: express.Request, res: express.Response) {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "SWITCH",
    ])
  ).rows;
  res.json(games);
}

async function getPs4Games(req: express.Request, res: express.Response) {
  const games = (
    await dbClient.query(`SELECT * FROM games where games.console = $1;`, [
      "PS4",
    ])
  ).rows;
  res.json(games);
}

async function getGames(req: express.Request, res: express.Response) {
  const games = (
    await dbClient.query(`SELECT * FROM games ORDER BY games.id DESC;`)
  ).rows;
  res.json(games);
}

async function getGamesV2(req: express.Request, res: express.Response) {
  const console = req.query.console;
  const bindings = [];
  let sql = `SELECT * FROM games`;
  if (console) {
    sql += ` WHERE console = $1`;
    bindings.push(console);
  }
  sql += ` ORDER BY games.id DESC;`;
  const games = (await dbClient.query(sql, bindings)).rows;
  res.json(games);
}

async function displayGame(req: express.Request, res: express.Response) {
  // 拎 params data
  const gameId = req.params.gameId;

  // 做野 db sql logic
  try {
    const queryResult = (
      await dbClient.query(
        "UPDATE games SET is_valid = true WHERE id = $1 RETURNING id",
        [gameId]
      )
    ).rows;
    console.log("displayedGame: ", queryResult);
    // 覆 user
    res.status(200).json({ message: "displayed" });
    return;
  } catch (e) {
    console.log("[ERROR]: ", e);
    res.status(500).json({ message: "internal server error" });
    return;
  }
}

async function delGame(req: express.Request, res: express.Response) {
  const gameId = req.params.gameid;

  try {
    const queryResult = (
      await dbClient.query(
        "UPDATE games SET is_valid = false WHERE id = $1 RETURNING id",
        [gameId]
      )
    ).rows;
    console.log("queryresult: ", queryResult);
    // 覆 user
    res.status(200).json({ message: "ok" });
    return;
  } catch (e) {
    console.log("[ERROR]: ", e);
    res.status(500).json({ message: "internal server error" });
    return;
  }
}

async function addProduct(req: express.Request, res: express.Response) {
  const productName = req.form.fields.productname;
  const price = Number(req.form.fields.price);
  const gamePlatform = req.form.fields.gameplatform;
  const gameType = req.form.fields.gametype;
  const customFile = req.form.files.customFile["newFilename"];
  const description = req.form.fields.description;
  const displayProduct = req.form.fields.displayProduct;
  const displayBoolean = displayProduct === "Display" ? true : false;

  if (isNaN(price)) {
    console.log("price is not number");
    res.status(400).json({ message: "price is not number" });
    return;
  }

  if (price >= 10_000) {
    res.status(400).json({ message: "too expensive" });
    return;
  }

  await dbClient.query(
    `
  INSERT INTO games 
  (name, price, game_cate, image, console, description, is_valid) 
  VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      productName,
      price,
      gameType,
      customFile,
      gamePlatform,
      description,
      displayBoolean,
    ]
  );

  res.status(200).json({ message: "ok" });
}
