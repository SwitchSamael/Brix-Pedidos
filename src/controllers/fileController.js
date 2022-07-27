import path from "path";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from "fs";

// const filePath = path.join("dist", "files", "table.json");
const filePath = path.join("dist", "files", "tableTest.json");

const CHECKBOX = "checkbox";
const INPUT = "input";
const TEXT = "text";

function createCell(element, name, type = "td", disabled = false, content = null) {
    return { element: element, name: name, type: type, disabled: disabled, content: content };
};

function get(_, res) {
    const jsonTablePath = path.join(__dirname, "..", "..", "dist", "files", "table.json");

    res.type("json");
    if (fs.existsSync(jsonTablePath)) {
        res.sendFile(jsonTablePath);
    } else res.status(204).send({ "Error 204": "Table not created!" });

    return;
};

function getTest(_, res) {
    const jsonTablePath = path.join(__dirname, "..", "..", "dist", "files", "tableTest.json");

    res.type("json");
    if (fs.existsSync(jsonTablePath)) {
        res.sendFile(jsonTablePath);
    } else res.status(204).send({ "Error 204": "Table not created!" });

    return;
};

function post(req, res) {
    res.end();

    generateNewTable(req.body);
    // saveJson(JSON.stringify(req.body));
    return;
};

function generateNewTable(json) {
    const rows = Object.values(json);

    rows.forEach((row, rowIndex) => {

        // Change empty fields from EAN column to "Não especificado"
        if (rowIndex === 0) {
            rows[rowIndex] = ["Serviço (Automático)", "Serviço (Manual)", "Quantidade", "Código Produto", "NCM", "EAN", "Descrição do Produto", "Unidade", "Segmento", "CE", "Novo Preço"];
        };

        row.unshift(createCell(INPUT, "amount", "th"));
        row.unshift(createCell(INPUT, "manualService", "th", true));
        row.unshift(createCell(CHECKBOX, "automaticService", "th", true));
        row.push(createCell(TEXT, "newPrice"));

        // Changes the value of the empty/wrong cells
        row.forEach((cell, cellIndex) => {

            // Change empty fields from EAN column to "Não especificado"
            if (cellIndex === 5 && cell === "") {
                row[cellIndex] = "Não especificado";
            };

            // Change empty and wrong fields from NCM column to "Não especificado"
            if (cellIndex === 4 && (cell === "" || cell === "11111111" || cell === "00000000")) {
                row[cellIndex] = "Não especificado";
            };

            // Calculate the new price to last column
            if (cellIndex === 10) {
                const oldPrice = row[9];
                const off30 = Number(oldPrice) + Number(oldPrice) * 0.3;
                const newPrice = off30 + off30 * 0.3;

                if (newPrice !== null) {
                    row[cellIndex] = newPrice.toFixed(2);
                } else {
                    row[cellIndex] = "Sob consulta";
                }

            };
        });
    });

    // rows.unshift();
    saveJson(JSON.stringify(rows));
};

function saveJson(jsonString) {
    try {
        fs.writeFile(filePath, jsonString, { encoding: "utf-8" }, error => {
            if (error) throw error;
        });
    } catch (error) {
        console.error(error);
    };
};


function process(req, res) {
    generateNewEditTable(req.body);
    res.json(req.body);
    return;
};

function generateNewEditTable(rows) {
    let checkboxHead = [];
    let alphabetHead = [];

    rows.forEach((row, rowIndex) => {
        row.unshift(createCell(TEXT, null, "th", false, (rowIndex + 1)));
        row.unshift(createCell(CHECKBOX, "selectRow", "th"));

        // Change all null cells to ""
        row.forEach((cell, cellIndex) => {
            if (cell === null) {
                row[cellIndex] = "";
            };
        });
    });

    //Add the Table Head
    rows[0].forEach((_, cellIndex) => {
        if (cellIndex >= 2) {
            checkboxHead.push(createCell(CHECKBOX, "selectColumn", "th"));
            alphabetHead.push(createCell(TEXT, null, "th", false, getAlphaOrder()));
        }
    });

    checkboxHead.unshift(createCell(TEXT, null, "th", false, ""), createCell(TEXT, TEXT, "th", false, ""));
    alphabetHead.unshift(createCell(TEXT, null, "th", false, ""), createCell(TEXT, TEXT, "th", false, "#"));

    rows.unshift(checkboxHead, alphabetHead);
};


let charCode = 65;
let firstRepetitionOfColumnName = true;
let columnNameArray = [String.fromCharCode(charCode)];

function getAlphaOrder() {
    columnNameArray.splice(-1);
    columnNameArray.push(String.fromCharCode(charCode));
    let columnName = columnNameArray.join("");

    charCode++;

    // When goes through all letters, goes back increasing the first letter
    if (charCode % 91 === 0) {
        charCode = 65;
        columnNameArray = ["A", String.fromCharCode(charCode)];

        if (firstRepetitionOfColumnName) firstRepetitionOfColumnName = false;
        else {
            const charCode = columnNameArray[0].charCodeAt(0);
            columnNameArray[0] = String.fromCharCode(charCode + 1);
        };
    };

    return columnName;
};

const fileController = {
    get: get,
    getTest: getTest,
    post: post,
    process: process
};

export { fileController };