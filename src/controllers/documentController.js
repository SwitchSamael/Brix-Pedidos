import fs from "fs";
import path from "path";
import transactionsJson from "../../dist/files/transactions.json" assert {type: "json"};

const filePath = path.join("dist", "files", "transactions.json");

function post(req, res) {
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

const documentController = {
    post: post
};

export { documentController };

