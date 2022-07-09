// // All //XX content must be un commented when upload to hosted server

// const express = require("express");
// // XX const serverless = require("serverless-http");
// const cors = require("cors");
// const path = require("path");
// const fs = require("fs");
// // const router = require("./routes")

// const bodyParser = require("body-parser");

// const app = express();
// const port = process.env.PORT || 9999;

// app.use(cors({ origin: `http://192.168.100.20:${port}` }));
// app.use(bodyParser.urlencoded({ extended: true }));

// //XX router.get("/", express.static(path.join("dist")));
// app.use("/", express.static(path.join("dist")));

// //XX app.use("/.netlify/functions/api", router);

// const fileController = require("./controllers/fileController");
// const multer = require("multer");

// //XX const filesPath = path.join("dist", "files"); 
// // const filesPath = path.join(__dirname, "..", "dist", "files")


// //XX const filesPath = path.join("dist", "files"); 
// const filesPath = path.join(__dirname, "..", "dist", "files")

// const storage = multer.diskStorage({
//     destination: function (_, _, callback) {
//         callback(null, filesPath);
//     },
//     filename: function (_, file, callback) {
//         callback(null, "Table" + path.extname(file.originalname));
//     }
// });

// // const upload = multer({ storage });

// app.post("/file/post", 
//     // upload.single("formattedTable"),
//     (req, res) => {
//         console.log(req);
//         console.log("Body: ");
//         console.log(req.body);

//         console.log("Query: ");
//         console.log(req.query);

//         console.log("File: ");
//         console.log(req.file);
//         res.end();
//         // return;
//     });

// // app.use(router);


// // This must be deleted when upload to hosted server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });

// //XX module.exports = app;
// //XX module.exports.handler = serverless(app);


const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 9999;

app.use(cors({ origin: `http://192.168.100.20:${port}` }));
app.use("/", express.static(path.join(__dirname, "..", "dist")));
app.use(fileUpload());


const storage = multer.diskStorage({
    destination: function (_, _, callback) {
        callback(null, path.join(__dirname, "..", "dist", "files"));
    },
    filename: function (_, file, callback) {
        callback(null, "Table" + path.extname(file.originalname));
    }
});

const upload = multer({storage});

app.post("/file/post",
// upload.single("inputtedTable"),
(req, res) => {
    console.log("---");
    console.log("Body: ");
    console.log(req.body);

    console.log("Query: ");
    console.log(req.query);

    console.log("File: ");
    console.log(req.file);

    console.log("Files: ");
    console.log(req.files.inputtedTable);
    res.end();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
