const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const app = express();
const port = process.env.PORT || 9999;

router.use(cors({origin: `http://192.168.100.20:${port}`}));

app.use("/.netlify/functions/api", router);
router.get("/", express.static(path.join("dist")));

module.exports = app;
module.exports.handler = serverless(app);