// const express = require("express");
import express from "express";
const router = express.Router();

// import tableController from "./controllers/tableController.js";
import { getIntelbrasHTML } from "./controllers/tableController.js";

import  fileController  from "./controllers/fileController.js";
import  clientsController from "./controllers/clientsController.js";
import contractsController from "./controllers/contractsController.js";

router.get("/table/get/intelbrasHTML", getIntelbrasHTML);

router.get("/table/intelbras/get", fileController.get);
router.post("/table/intelbras/post", fileController.post);

router.post("/table/editTable/process", fileController.processEditTable);

router.get("/contract/nextSerialNumber", clientsController.getNextSerialNumber);
router.get("/contract/pdf", contractsController.pdf);

router.post("/client/create", clientsController.create);

router.get("/", (_, res) => {
    res.render("home");
});

router.get("/R", clientsController.r);

router.get("/editTable", (_, res) => {
    res.render("editTable");
});

export { router };
// module.exports = router;