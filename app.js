const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 9999;

app.use(cors({origin: `http://192.168.3.226:${port}`}));
app.use(express.static(path.join(__dirname, "public")));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});