const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = 3000; // 可以更改為您希望的端口

const cors = require("cors");
// 啟用所有 CORS 請求
app.use(cors());

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const LINE_NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit-feedback", (req, res) => {
  const feedback = req.body.feedback;

  lineNotify(feedback)
    .then(() => {
      res.send("感謝您的回饋！");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("發生錯誤");
    });
});

function lineNotify(message) {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${LINE_NOTIFY_TOKEN}`,
  };

  const data = new URLSearchParams();
  data.append("message", message);

  return axios.post("https://notify-api.line.me/api/notify", data, { headers });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
