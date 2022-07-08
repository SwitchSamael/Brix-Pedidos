const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const router = express.Router();

const xlsx = require("xlsx");

// const filesPath = path.join("dist", "files"); 
const filesPath = path.join(__dirname, "..", "dist", "files"); 

let workbook = xlsx.readFile(path.join(filesPath, "Table.xlsx"), { cellDates: true });
let worksheet = workbook.Sheets[workbook.SheetNames[0]];
let data = xlsx.utils.sheet_to_json(worksheet);

let formattedTableJson = {};

let initialRowIndex = 4;

data.map((rowObject, rowIndex) => {
    if (rowIndex >= initialRowIndex && rowIndex <= 6) {
        formattedTableJson[`row${rowIndex - initialRowIndex}`] = [];
        Object.entries(rowObject).map((cellArray, cellIndex) => {
            const cell = cellArray[1];
            if (cellIndex <= 5 || cellIndex === 11) {
                formattedTableJson[`row${rowIndex - initialRowIndex}`].push(cell);
            }
        })

    }
})

console.log(formattedTableJson);
const app = express();
const port = process.env.PORT || 9999;

router.use(cors({ origin: `http://192.168.100.20:${port}` }));

// app.use("/.netlify/functions/api", router);
// router.get("/", express.static(path.join("dist")));

app.use("/", express.static(path.join("dist")));


})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})

// module.exports = app;
// module.exports.handler = serverless(app);