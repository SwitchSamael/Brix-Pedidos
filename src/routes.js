const express = require("express");
const router = express.Router();
const fileController = require("./controllers/fileController");
const documentController = require("./controllers/documentController");
const path = require("path");
const xlsx = require("xlsx");


// let workbook = xlsx.readFile(path.join(filesPath, "Table.xlsx"), { cellDates: true });
// let worksheet = workbook.Sheets[workbook.SheetNames[0]];
// let data = xlsx.utils.sheet_to_json(worksheet);

// let formattedTableJson = {};

// let initialRowIndex = 4;

// data.map((rowObject, rowIndex) => {
//     if (rowIndex >= initialRowIndex && rowIndex <= 6) {
//         formattedTableJson[`row${rowIndex - initialRowIndex}`] = [];
//         Object.entries(rowObject).map((cellArray, cellIndex) => {
//             const cell = cellArray[1];
//             if (cellIndex <= 5 || cellIndex === 11) {
//                 formattedTableJson[`row${rowIndex - initialRowIndex}`].push(cell);
//             };
//         });

//     };
// }); 

// console.log(formattedTableJson);

// try {
//     const formattedTableJsonString = JSON.stringify(formattedTableJson)
//     fs.writeFile(path.join(filesPath, "formattedTable.json"), formattedTableJsonString, { encoding: "utf-8", "flag": "w" }, (error) => {
//         if (error) throw error;
//     })
// } catch (error) {
//     console.log("Error on writing json file!");
//     console.error(error);
// }


router.get("/file/get", fileController.get);
router.get("/file/getTest", fileController.getTest);

router.post("/file/post", fileController.post);
router.post("/file/process", fileController.process);

router.post("/document/post", documentController.post);

router.get("/", (_, res) => {
    res.redirect(307, "/dist/index.html")
});

module.exports = router;
