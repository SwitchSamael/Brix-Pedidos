import fs from "fs";
import path from "path";
import contractsJson from "../files/contracts.json" assert {type: "json"};

const filePath = path.join("src", "files", "contracts.json");

function getNextSerialNumber(_, res) {
    res.send({serialNumber: contractsJson.serialNumber + 1});
};

function post(req, res) {
    res.end();
    saveContract(req.body);
    return;
};

function saveContract(client) {
    console.log(client)

    // contractsJson.push(client);

    // try {
    //     fs.writeFile(filePath, JSON.stringify(contractsJson), { encoding: "utf-8" }, error => {
    //         if (error) throw error;
    //     });
    // } catch (error) {
    //     console.error(error);
    // };
};

const contractsController = {
    getNextSerialNumber: getNextSerialNumber,
    post: post
};

export { contractsController };

