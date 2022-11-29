import pg from "pg";

export class UserService {
  constructor(private dbClient: pg.Client) {}

  async getUserByUsername(username: string) {
    const queryResult = await this.dbClient.query(
      `SELECT * FROM users where users.username=$1`,
      [username]
    );
    return queryResult.rows[0];
  }
}
