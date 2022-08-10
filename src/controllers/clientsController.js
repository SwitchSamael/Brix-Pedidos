import fs from "fs";
import path from "path";
import clientsJson from "../files/clients.json" assert {type: "json"};

const filePath = path.join("src", "files", "clients.json");


function create(req, res) {
    saveInFile(req.body, error => {
        if (error) res.status(502).send("Erro ao Salvar Contrato: " + error);
        return;
    });

    res.end();
    return;
};

function update() {

};

function getOne() {

};

function addContract() {

};

function getNextSerialNumber(_, res) {
    res.send({ nextSerialNumber: clientsJson.nextSerialNumber });
};

function saveInFile(newClient, errorCallback) {
    clientsJson.clients.push(newClient);
    clientsJson.nextSerialNumber++;

    try {
        fs.writeFile(filePath, JSON.stringify(clientsJson), { encoding: "utf8" }, error => {
            if (error) throw error;
        });

    } catch (error) {
        errorCallback(error);
    };
};

const clientsController = {
    create,
    update,
    getOne,
    addContract,
    getNextSerialNumber,
};

export { clientsController };

