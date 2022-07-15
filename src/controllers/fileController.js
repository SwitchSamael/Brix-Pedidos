const path = require("path");
const fs = require("fs");

//XX const filesPath = path.join("dist", "files"); 
const filePath = path.join("dist", "file", "table.json");

exports.get = (_, res) => {
    const jsonTablePath = path.join(__dirname, "..", "..", "dist", "file", "table.json");

    res.type("json");
    if (fs.existsSync(jsonTablePath)) {
        res.sendFile(jsonTablePath);
    }
    else res.status(404).send({"Error 404": "Table not created!"});

    return;
};

exports.post = (req, res) => {
    res.end();
    saveJson(JSON.stringify(req.body));
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