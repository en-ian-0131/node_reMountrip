if (process.argv[2] && process.argv[2] === "start") {
  console.log("process:", process.argv);
  console.log("2:", require("dotenv").config({ path: "./production.env" }));
  console.log("123:", process.env);
} else {
  console.log("process:", process.argv);
  console.log("1:", require("dotenv").config({ path: "./dev.env" }));
  console.log("321:", process.env);
}

const express = require("express");
const cors = require("cors");
const db = require("./module/db_connection");

const server = express();
server.use(cors());
server.use(express.static("public"));

server.get("/", async (req, res) => {
  res.send("Hello~");
});

server.get("/trails_Limit8", async (req, res) => {
  const [response] = await db.query("SELECT * From trails LIMIT 8");
  res.json(response);
});
server.get("/member_limit1", async (req, res) => {
  const [response] = await db.query("SELECT * FROM member LIMIT 1");
  res.json(response);
});
server.get("/coupon_limit1", async (req, res) => {
  const [response] = await db.query("SELECT * FROM coupon LIMIT 5");
  res.json(response);
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
