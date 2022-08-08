// const express = require("express");
import express from "express";
import pdf from "html-pdf";
import fs from "fs";
import path from "path";
import ejs from "ejs";
import puppeteer from "puppeteer";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// import tableController from "./controllers/tableController.js";
import { getIntelbrasHTML } from "./controllers/tableController.js";

import { fileController } from "./controllers/fileController.js";
import { clientsController } from "./controllers/clientsController.js";

import clientsJson from "./files/clients.json" assert {type: "json"};

router.get("/table/get/intelbrasHTML", getIntelbrasHTML);

router.get("/table/intelbras/get", fileController.get);
router.post("/table/intelbras/post", fileController.post);

router.post("/table/editTable/process", fileController.processEditTable);

router.get("/contract/nextSerialNumber", clientsController.getNextSerialNumber);
router.post("/client/create", clientsController.createClient);

// router.get("/pdf", async (_, res) => {
// const ejsFile = fs.readFileSync(path.join(__dirname, "..", "dist", "generateContract.html"), "utf8");
// const html = await ejs.render(ejsFile, { "nextSerialNumber": 30 });
//  return;
// });
router.get("/pdf", async (_, res) => {
    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.screenshot()
        await page.screenshot({path: "../dist/images/Brix_logo.jpeg"});
        const ejsFile = fs.readFileSync(path.join(__dirname, "..", "dist", "generateContract.html"), "utf8");
        const pdfConfiguration = {
            "path": "src/files/contractPuppeteer.pdf",
            "format": "A4",
            "printBackground": true,
        };

        await page.setContent(ejsFile, {waitUntil: "networkidle2"});
        await page.emulateMediaType("screen");
        await page.pdf(pdfConfiguration);

        browser.close();
    } catch (error) {
        console.error(error);
    } finally {
        res.end();
    };


    // const html = await ejs.render(ejsFile, { "nextSerialNumber": 30 });
    // const html = compiled({ "nextSerialNumber": 30 });

    // const htmlPath = path.join(__dirname, "..", "dist", "generateContract.html")

    // const html = fs.readFileSync(htmlPath, "utf8").toString();
    // //     // // console.log(html);
    // const options = {
    //     //         type: "pdf",
    //     format: "A4",
    //     //         orientation: "portrait"
    // };

    // pdf.create(html, options).toBuffer((error, buffer) => {
    //     // if (error) return res.status(500).json(error);

    //     res.end(buffer);
    // });

    //  return;
});

router.get("/", (_, res) => {
    res.render("home");
});

router.get("/editTable", (_, res) => {
    res.render("editTable");
});

router.get("/generateContract", (_, res) => {
    const nextSerialNumber = clientsJson.nextSerialNumber;
    res.render("generateContract", { "nextSerialNumber": nextSerialNumber });
});

export { router };
// module.exports = router;