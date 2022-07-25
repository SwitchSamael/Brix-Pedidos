const path = require("path");
const fs = require("fs");

// const filePath = path.join("dist", "files", "table.json");
const filePath = path.join("dist", "files", "tableTest.json");

// const CHECKBOX_ID = "{type: checkbox, name=}"
const AUTOMATIC_SERVICE_ID = { type: "checkbox", name: "automaticService" };
const MANUAL_SERVICE_ID = { type: "input", name: "manualService" };
const AMOUNT_ID = { type: "input", name: "amount" };
const NEW_PRICE_ID = "";

exports.get = (_, res) => {
    const jsonTablePath = path.join(__dirname, "..", "..", "dist", "files", "table.json");

    res.type("json");
    if (fs.existsSync(jsonTablePath)) {
        res.sendFile(jsonTablePath);
    }
    else res.status(204).send({ "Error 204": "Table not created!" });

    return;
};

exports.getTest = (_, res) => {
    const jsonTablePath = path.join(__dirname, "..", "..", "dist", "files", "tableTest.json");

    res.type("json");
    if (fs.existsSync(jsonTablePath)) {
        res.sendFile(jsonTablePath);
    }
    else res.status(204).send({ "Error 204": "Table not created!" });

    return;
};

exports.post = (req, res) => {
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

        row.unshift(AMOUNT_ID);
        row.unshift(MANUAL_SERVICE_ID);
        row.unshift(AUTOMATIC_SERVICE_ID);
        row.push(NEW_PRICE_ID);
        
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
                const newPrice = Number(oldPrice) + Number(oldPrice) * 0.3;

                if(newPrice !== null){
                    row[cellIndex] = newPrice.toFixed(2);
                }else{
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

exports.process = (req, res) => {
    res.end();

    console.log(req.body);
    // generateNewTable(req.body);
    // saveJson(JSON.stringify(req.body));
    return;
};
