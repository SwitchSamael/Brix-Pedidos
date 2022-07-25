const path = require("path");
const fs = require("fs");

const filePath = path.join("dist", "files", "table.json");

exports.get = (_, res) => {
    const jsonTablePath = path.join(__dirname, "..", "..", "dist", "files", "table.json");

    res.type("json");
    if (fs.existsSync(jsonTablePath)) {
        res.sendFile(jsonTablePath);
    }
    else res.status(204).send({ "Error 204": "Table not created!" });

    return;
};


    return;
};

exports.post = (req, res) => {
    res.end();
    return;
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