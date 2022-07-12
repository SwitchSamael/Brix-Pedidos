const path = require("path");
const fs = require("fs");

//XX const filesPath = path.join("dist", "files"); 
const filePath = path.join("dist", "file", "table.json");

exports.get = (_, res) => {
    const jsonFilePath = path.join(__dirname, "..", "dist", "files", "formattedTable.json");

    res.type("json");
    //    res.send(json)
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