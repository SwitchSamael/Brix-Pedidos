// const Table = require("../controllers/table");
import { Table } from "../controllers/table.js";
// const table = new Table();

function getIntelbrasHTML(req, res) {
    console.log(Table)
    const html = Table.generateHTML();
    // res.header("html");
    res.send(html);
};

export { getIntelbrasHTML }