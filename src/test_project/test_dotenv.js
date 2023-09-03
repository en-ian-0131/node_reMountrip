const dotenv = require("dotenv");  //將.env加載到 process.env中

console.log("config:", dotenv.config()); //從根目錄中找.env檔，並讀取.env中的資料
console.log("process:", process.env);  //process.env中基本設定跟外部加載的資料
