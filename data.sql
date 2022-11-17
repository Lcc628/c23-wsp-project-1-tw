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
    is_valid boolean ,
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
    game_id int,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
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



INSERT INTO users (username,password,email,icon,address,phone_number,is_admin) VALUES ('admin','881229','123@gmail.com','test.jpg','hk','123456','true'),('user','123123','123123@gmail.com','test.jpg','hk','123456','false');


INSERT INTO shopping_cart (user_id) VALUES ('1');

INSERT INTO games (name,price,game_cate,image,console,description,is_valid) VALUES ('《 機動戰士鋼彈 極限 VS. 極限爆發 》','418','動作','game1.jpeg','PS4','「機動戰士鋼彈 極限 VS系列」首款家用主機於 2014 年問世，而本作《機動戰士鋼彈 極限 VS. 極限爆發》是 2016 年開始在街機營運的作品，是一款主打 2V2 團隊戰鬥的大型機台，玩家可以使用各系列知名機體的爆發技能來進行攻防，這次的《機動戰士鋼彈 極限 VS. 極限爆發》從鋼彈 36 款作品中擷取 183 台機體參戰','true'),
('NS Pokemon《寶可夢 朱/紫》','340','RPG','game2.jpeg','SWITCH','在《寶可夢 朱／紫》中，玩家將能在豐富呈現的開放世界中自由地冒險。
無縫綿延的遼闊大自然、城鎮街景，以及栩栩如生地生活在其中的寶可夢們。
不論是在天空、海洋、森林，還是在城鎮，在這個世界的每個角落都有可能見到寶可夢們的身影。
《寶可夢》系列不可或缺的寶可夢對戰、捕捉寶可夢等精華樂趣在本作中絲毫不減，
是從小朋友到大人都能夠歡樂遊玩的開放世界作品。','true'),

('《艾爾登法環》','339','RPG','game3.jpeg','PC','艾爾登法環是以正統黑暗奇幻世界為舞台的動作RPG遊戲。 走進遼闊的場景與地下迷宮探索未知，挑戰困難重重的險境，享受克服困境時的成就感吧。 不僅如此，登場角色之間的利害關係譜成的群像劇，更是不容錯過。','true'),

('Xbox Series X|S《Fifa 23》','527','運動','game4.jpeg','XBOX','《EA SPORTS™ FIFA 23》獻上世界性遊戲，包括男子組和女子組FIFA World Cup™巡迴賽，並新增女子俱樂部球隊，並讓您以全新方式遊玩您最愛的模式。','true'),

('核心危機 : 最終幻想VII Reunion》CRISIS CORE FINAL FANTASY VII REUNION (限定版)','2190','RPG','game5.webp','SWITCH','
本作除了將畫面HD化之外，包括登場角色在內的所有3D模型也將煥然一新。支援全語音的內容和全新改編的樂曲將更加生動地描繪出波瀾萬丈的故事。
《CRISIS CORE –FINAL FANTASY VII– REUNION》的主角——青年札克斯‧菲爾不僅是未來拯救世界的少年所憧憬之人，還受到傳奇英雄的信賴，更被掌握星球命運的少女所深愛著。他託付給克勞德的夢想與尊嚴，描述這「一切」的壯大故事，如今實現超越HD復刻的進化。','true'),

('NS《星之卡比 Wii》豪華版','329','動作','game6.jpeg','SWITCH','
變得更豪華的《星之卡比 Wii》
在Nintendo Switch登場
於2011年發售的《星之卡比 Wii》在Nintendo Switch上重生。以嶄新的圖像，卡比與同伴們一起享受最多4人的冒險。','true'),

('NS《魔物獵人崛起:破曉》MONSTER HUNTER RISE + SUNBREAK 組合包盒裝版','399','狩獵動作','game7.jpeg','SWITCH','
《MONSTER HUNTER RISE: SUNBREAK》是《MONSTER HUNTER RISE》的超大型擴充內容。
進化得更為輕快的動作、各具個性的魔物和原野，還有充滿挑戰性的Master Rank任務登場。
曾經從災禍當中拯救村莊的獵人，這次為了拯救因古龍「爵銀龍」而陷入危機的王國，而在新天地向全新的狩獵發起挑戰！','true'),

('Xbox One《數碼寶貝 絕境求生》Digimon Survive','402','文字冒險、策略戰鬥','game8.jpeg','XBOX','
本作描述一群誤闖進異世界的少年少女為了回到原本的世界，與在當地相遇的怪獸結伴展開的冒險歷程。
由文字冒險部分，以及將同行怪獸作為操縱單位，與敵對怪獸交戰的策略戰鬥部份等兩大主軸所構成，是一款文字冒險+策略戰鬥遊戲。','true')
;
-- ,('game3','400','RPG','https://i.openshop.com.hk/upload/202006/5ed5caae2216d.jpg','PS4','hihihihi','true'),
-- ('game4','500','RPG','https://img.openshop.com.hk/s2/202208/630454b0be157.jpg','SWITCH','hihihihi','true'),('game5','500','RPG','https://img.openshop.com.hk/s2/202208/62ff59c56c3ef.jpg','PC','hihihihi','true'),('game6','500','RPG','https://img.openshop.com.hk/s2/202209/63356bc5b09fb.jpg','XBOX','hihihihi','true');



-- INSERT INTO game_shoppingCart_Map (game_id,shopping_cart_id) VALUES ('1','1'),('2','1');

-- INSERT INTO transaction (user_id,total_amount) VALUES ('1','200'),('2','200');

-- INSERT INTO transaction_detail (price,quanity,transaction_id,game_id) VALUES ('100','10','1','1'),('100','5','1','2');

