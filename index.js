if (process.argv[2] && process.argv[2] === "start") {
  // console.log("process:", process.argv);
  require("dotenv").config({ path: "./production.env" });
  // console.log("2:", require("dotenv").config({ path: "./production.env" }));
  // console.log("123:", process.env);
} else {
  require("dotenv").config({ path: "./dev.env" });
  // console.log("process:", process.argv);
  // console.log("1:", require("dotenv").config({ path: "./dev.env" }));
  // console.log("321:", process.env);
}

const express = require("express");
const cors = require("cors");
const db = require("./module/db_connection");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const MsqlSession = require("express-mysql-session")(session);
const sessionStore = new MsqlSession(db);

const server = express();
server.use(cors());
server.use(express.static("public"));
server.use(express.json());
server.use(
  session({
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: "oijrgvlgmojrbl;kerjglekrgv1312",
  })
);

server.get("/", async (req, res) => {
  res.send("Hello~");
});
server.get("/try_sess", (req, res) => {
  req.session.count = req.session.count || 0;
  req.session.conut++;
  res.json(req.session);
});
server.get("/trails_Limit8", async (req, res) => {
  const [response] = await db.query("SELECT * From trails LIMIT 8");
  res.json(response);
});
server.get("/member", async (req, res) => {
  const [response] = await db.query(
    `SELECT member.account,member.firstname,member.lastname,member.gender,member.birthday,member.city,member.address,member.email,member.mobile FROM member WHERE member.account="${req.query.account}"`
  );
  res.json(response);
});
server.get("/coupon_limit5", async (req, res) => {
  const [response] = await db.query("SELECT * FROM coupon LIMIT 5");
  res.json(response);
});

server.get("/getlikeData", async (req, res) => {
  const [response] = await db.query(
    `SELECT trails.sid,trails.trail_name,favorite.status FROM trails JOIN favorite ON favorite.trails_sid = trails.sid WHERE favorite.member_sid = ${req.query.memberSid} AND favorite.status = 0`
  );
  res.json(response);
});
server.get("/getlike", async (req, res) => {
  const [response] = await db.query(
    `SELECT favorite.trails_sid,favorite.status FROM favorite WHERE member_sid=${req.query.memberSid}`
  );
  res.json(response);
});
server.get("/saveLike", async (req, res) => {
  const selectData = await db.query(
    `SELECT * FROM favorite WHERE favorite.member_sid IN (${req.query.memberSid}) AND favorite.trails_sid IN (${req.query.trailSid})`
  );

  if (selectData[0].length === 0) {
    const [NoData] = await db.query(
      `INSERT INTO favorite(member_sid, trails_sid, status) VALUES (${req.query.memberSid},${req.query.trailSid},${req.query.favoriteState})`
    );
    res.json(NoData);
  } else {
    const [haveData] = await db.query(
      `UPDATE favorite SET favorite.status=${req.query.favoriteState} WHERE favorite.member_sid = ${req.query.memberSid} AND favorite.trails_sid= ${req.query.trailSid}`
    );
    res.json(haveData);
  }
});
server.post("/login", async (req, res) => {
  const output = {
    success: false,
    error: 1,
    body: req.body,
    message: "",
  };
  const sql = "SELECT * FROM admins WHERE account=?";

  const [rows] = await db.query(sql, [req.body.account]);

  if (!rows.length) {
    output.message = "帳號錯誤!";
  } else {
    if (!(await bcrypt.compare(req.body.password, rows[0].password_hash))) {
      output.message = "密碼錯誤!";
    } else {
      output.success = true;
      output.error = 0;
      output.message = "成功登入~";
      output.admins = {
        sid: rows[0].sid,
        account: rows[0].account,
        nickname: rows[0].nickname,
      };
    }
  }

  res.json(output);
});

server.use((req, res) => {
  res.type("text/html");
  res.status(404).send(`
  <h2>404 頁面</h2>
  <img src="/imgs/12345.jpeg" />
  `);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`伺服器啟動 ${port}`);
});
