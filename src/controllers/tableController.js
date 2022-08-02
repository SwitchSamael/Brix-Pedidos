import { Table } from "../controllers/table.js";
import intelbrasTable from "../files/table.json" assert {type: "json"};

const table = new Table();

function getIntelbrasHTML(req, res) {
    const html = table.generateHTML(Object.values(intelbrasTable));
    // res.header("html");
    res.send(html);
};

export { getIntelbrasHTML };