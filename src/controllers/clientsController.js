import fs from "fs";
import path from "path";
import clientsJson from "../files/clients.json" assert {type: "json"};

const filePath = path.join("src", "files", "clients.json");


function createClient(req, res) {
    res.end();
    saveClient(req.body);
    return;
};

function updateClient() {

};

function getClient() {

};

function addContract() {

};

function getNextSerialNumber(_, res) {
    res.send({ nextSerialNumber: clientsJson.nextSerialNumber });
};

function saveClient(newClient) {
    // clientsJson.clients.push(client);
    // clientsJson.nextSerialNumber++;
    // console.log(clientsJson.clients.filter(client => client newClient))
    console.log(clientsJson.clients[0])
    console.log(clientsJson.clients[0].id)

    // try {
    //     fs.writeFile(filePath, JSON.stringify(clientsJson), { encoding: "utf8" }, error => {
    //         if (error) throw error;
    //     });
    // } catch (error) {
    //     console.error(error);
    // };
};

const clientsController = {
    createClient,
    updateClient,
    getClient,
    addContract,
    getNextSerialNumber,
};

export { clientsController };

