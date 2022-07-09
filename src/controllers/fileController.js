const multer = require("multer");
const path = require("path");

//XX const filesPath = path.join("dist", "files"); 
const filesPath = path.join(__dirname, "..", "dist", "files")

const storage = multer.diskStorage({
    destination: function (_, _, callback) {
        callback(null, filesPath);
    },
    filename: function (_, file, callback) {
        callback(null, "Table" + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

exports.get = (_, res) => {
    const jsonFilePath = path.join(__dirname, "..", "dist", "files", "formattedTable.json");

    res.type("json");
    //    res.send(json)
    return;
}

exports.postMiddleware = upload.single("inputtedTable");

exports.post = (req, res) => {
    console.log("File: ");
    console.log(req.file);
    res.end();
    return;
};