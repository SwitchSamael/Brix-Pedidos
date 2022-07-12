const path = require("path");

//XX const filesPath = path.join("dist", "files"); 
const filesPath = path.join(__dirname, "..", "dist", "files")

exports.get = (_, res) => {
    const jsonFilePath = path.join(__dirname, "..", "dist", "files", "formattedTable.json");

    res.type("json");
    //    res.send(json)
    return;
}

exports.post = (req, res) => {
    console.log("---");
    console.log("Body: ");
    console.log(req.body);
    res.end();
    return;
};