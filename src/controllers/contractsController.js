import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";
import clientsJson from "../files/clients.json" assert {type: "json"};
import puppeteer from "puppeteer";

import ejs from "ejs";

async function pdf(req, res) {
    const client = getClientById(req.query.clientId);
    const dataToReplace = generateDataToReplace(client);
    console.log(dataToReplace)
    await renderHtml(dataToReplace);
    await htmlToPDF();

    // promise.catch(error => {
    //     res.status(502).send("Error While Generating PDF: " + error);
    // });


    const pdfPath = path.join(__dirname, "..", "files", "contract.pdf");
    res.download(pdfPath);
};

// This function must be in the clientController
function getClientById(clientId) {
    return clientsJson.clients.filter(client => client.id === clientId)[0];
};

function generateDataToReplace(client) {
    const data = {};
    data["serialNumber"] = client.contracts[0].serialNumber;
    data["name"] = client.name;
    data["houseNumber"] = client.houseNumber;
    data["address"] = client.address;
    data["cep"] = client.cep;
    data["city"] = client.city;
    data["district"] = client.district;
    data["phone"] = client.phone;
    data["email"] = client.email;
    data["products"] = client.products;

    return data;
};

function renderHtml(dataToReplace) {
    return new Promise(resolve => {

        const htmlPath = path.join(__dirname, "..", "views", "contract.ejs");

        fs.readFile(htmlPath, { encoding: "utf8" }, (error, data) => {
            if (error) throw error;
            const html = ejs.render(data, dataToReplace);

            fs.writeFile(htmlPath, html, () => {
                resolve();
            });
        });

    });
};

function htmlToPDF() {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();

            await page.screenshot({ path: path.join(__dirname, "..", "..", "dist", "images", "Brix_logo.jpeg") });
            const ejsFile = fs.readFileSync(path.join(__dirname, "..", "views", "contract.ejs"), "utf8");
            const pdfConfiguration = {
                "path": "src/files/contract.pdf",
                "format": "A4",
                printBackground: true,
            };

            await page.setContent(ejsFile, { waitUntil: "networkidle0" });
            await page.emulateMediaType("screen");
            await page.pdf(pdfConfiguration);

            browser.close();
            resolve();
        } catch (error) {
            reject(error);
        };

    });

};

export default {
    pdf
};