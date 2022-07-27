import { Table } from "../controllers/table.js";
import intelbrasTable from "../../dist/files/tableTest.json" assert {type: "json"};

const table = new Table();

function getIntelbrasHTML(req, res) {
    // console.log(Table)
    const html = table.generateHTML(Object.values(intelbrasTable));
    // res.header("html");
    res.send(html);
};

export { getIntelbrasHTML }