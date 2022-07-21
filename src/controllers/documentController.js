const fs = require("fs");
const path = require("path");
const transactionsJson = require("../../dist/files/transactions.json").transactions;

const filePath = path.join("dist", "files", "transactions.json");

exports.post = (req, res) => {
    res.end();
    saveTransaction(req.body);
    return;
};

function saveTransaction(transaction) {
    transactionsJson.push(transaction);

    try {
        fs.writeFile(filePath, JSON.stringify(transactionsJson), { encoding: "utf-8" }, error => {
            if (error) throw error;
        });
    } catch (error) {
        console.error(error);
    }
};
