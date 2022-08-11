// // All //XX content must be un commented when upload to hosted server

import express from "express";
// const express = require("express");
// //XX const serverless = require("serverless-http");

import path from "path";
// const path = require("path");

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { router } from "./routes.js";
// const router = require("./routes");

import bodyParser from "body-parser";
// const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 9999;

const corsList = ["http://localhost:9999",
    "http://127.0.0.1:5500/dist/index.html",
    `http://127.0.0.1:${port}`];

app.use((req, res, next) => {
    if (!corsList.includes(req.headers.origin)) {
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header(('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'));
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1mb" }));

// //XX router.get("/", express.static(path.join("dist")));
app.use("/", express.static(path.join(__dirname, "..", "dist")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// //XX app.use("/.netlify/functions/api", router);
app.use(router);

// This must be deleted when upload to hosted server
app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
    console.log("Access http://127.0.0.1:9999");
});

// //XX module.exports = app;
// //XX module.exports.handler = serverless(app);