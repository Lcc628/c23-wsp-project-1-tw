DROP TABLE IF EXISTS users,games,shopping_cart,game_shoppingCart_Map,transaction,transaction_detail;

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    email varchar(50) UNIQUE,
    icon varchar(255),
    address varchar(255),
    phone_number varchar(255),
    is_admin boolean,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS games(
    id SERIAL PRIMARY KEY,
    name varchar(255),
    price decimal(6,2),
    game_cate varchar(255),
    image varchar(255),
    console varchar(255),
    description text,
    is_valid boolean,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON games
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS shopping_cart(
    id SERIAL PRIMARY KEY,
    user_id int,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON shopping_cart
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS game_shoppingCart_Map(
    id SERIAL PRIMARY KEY,
    game_id int REFERENCES games(id) ON DELETE CASCADE,
    shopping_cart_id int,
    FOREIGN KEY (shopping_cart_id) REFERENCES shopping_cart(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON game_shoppingCart_Map
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS transaction(
    id SERIAL PRIMARY KEY,
    user_id int,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    total_amount decimal(6,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON transaction
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE IF NOT EXISTS transaction_detail(
    id SERIAL PRIMARY KEY,
    price decimal(6,2),
    quanity int,
    transaction_id int,
    FOREIGN KEY (transaction_id) REFERENCES transaction(id) ON DELETE CASCADE,
    game_id int REFERENCES games(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON transaction_detail
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ('admin','881229','123@gmail.com','test.jpg','hk','123456','true'),('test','881229','hi@gmail.com','test.jpg','hk','1234567','false');

INSERT INTO games (name,price,game_cate,image,console,description,is_valid) VALUES ('game1','100','RPG','https://i.openshop.com.hk/upload/202003/5e81885bb7ad9.jpg','PS4','hihihihi','true'),('game2','200','RPG','https://i.openshop.com.hk/upload/202202/621c65b983f19.jpg','SWITCH','byebyebye','true'),('game3','400','RPG','https://i.openshop.com.hk/upload/202006/5ed5caae2216d.jpg','PS4','hihihihi','true'),
('game4','500','RPG','https://img.openshop.com.hk/s2/202208/630454b0be157.jpg','SWITCH','hihihihi','true'),('game5','500','RPG','https://img.openshop.com.hk/s2/202208/62ff59c56c3ef.jpg','PC','hihihihi','true'),('game6','500','RPG','https://img.openshop.com.hk/s2/202209/63356bc5b09fb.jpg','XBOX','hihihihi','true');

INSERT INTO shopping_cart (user_id) VALUES ('1'),('2');

INSERT INTO game_shoppingCart_Map (game_id,shopping_cart_id) VALUES ('1','1'),('2','1');

INSERT INTO transaction (user_id,total_amount) VALUES ('1','200'),('2','200');

INSERT INTO transaction_detail (price,quanity,transaction_id,game_id) VALUES ('100','10','1','1'),('100','5','1','2');


