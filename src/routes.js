// const express = require("express");
import express from "express";

const router = express.Router();

// import tableController from "./controllers/tableController.js";
import {getIntelbrasHTML} from "./controllers/tableController.js";

import {fileController} from "./controllers/fileController.js";
import {contractsController} from "./controllers/contractsController.js";

import contractsJson from "./files/contracts.json" assert {type: "json"};

router.get("/table/get/intelbrasHTML", getIntelbrasHTML);

router.get("/table/intelbras/get", fileController.get);
router.post("/table/intelbras/post", fileController.post);

router.post("/table/editTable/process", fileController.processEditTable);

router.get("/contract/nextSerialNumber", contractsController.getNextSerialNumber);
router.post("/contract/post", contractsController.post);


router.get("/", (_, res) => {
    res.render("home");
});

router.get("/editTable", (_, res) => {
    res.render("editTable");
});

router.get("/generateContract", (_, res) => {
    const serialNumber = contractsJson.serialNumber;
    res.render("generateContract", {"serialNumber": serialNumber + 1});
});

export {router};
// module.exports = router;