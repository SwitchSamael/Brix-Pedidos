import fs from "fs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import path from "path";
import clientsJson from "../files/clients.json" assert {type: "json"};
import puppeteer from "puppeteer";
import ejs from "ejs";

const htmlModelPath = path.join(__dirname, "..", "views", "contractModel.ejs");
const htmlResultPath = path.join(__dirname, "..", "files", "contract.html");
const pdfPath = path.join(__dirname, "..", "files", "contract.pdf");

async function pdf(req, res) {
    const client = getClientById(req.query.clientId);
    const dataToReplace = generateDataToReplace(client);
    await renderHtml(dataToReplace);
    await htmlToPDF();

    // promise.catch(error => {
    //     res.status(502).send("Error While Generating PDF: " + error);
    // });

    res.download(pdfPath);
};

// This function must be in the clientController
function getClientById(clientId) {
    return clientsJson.clients.filter(client => client.id === clientId)[0];
};

/*

                <% items.forEach( item=> {
 
                    <tr> 
                        <td>
                            <%=item.id%>
                        </td>
                        <td>
                            <%=item.description%>
                        </td>
                        <td>
                            <%=item.quantity%>
                        </td> 
                        <td>
                            <%=item.presentPrice.toFixed(2) + " R$"%>
                        </td> 
                        <td>
                            <%=item.finalPrice.toFixed(2) + " R$"%>
                        </td>
                    </tr>
                    })%>

                    <% <tr>
                        <th colspan="3">Preço Global</th>
                        <th colspan="3">
                            <%=item.finalPrice.toFixed(2) + "R$"%>
                        </th>
                        </tr>

                        insertInstallmentRow()

                        function insertInstallmentRow() {
                        if (paymentMethod === "installment") {
                        <tr>
                            <th colspan="5">
                                <%= Parcelado em <%=installments%> X de <%=installmentPrice.toFixed(2) R$%> %>
                            </th>
                        </tr>
                        };
                        %>

*/
function generateDataToReplace(client) {
    const data = {};
    data["serialNumber"] = client.contracts[0].serialNumber;
    data["name"] = client.name;
    data["houseNumber"] = client.houseNumber;
    data["address"] = client.address;
    data["cep"] = client.cep;
    data["city"] = client.city;
    data["district"] = client.district;
    data["phoneNumber"] = client.phoneNumber;
    data["email"] = client.email;
    data["items"] = client.products.items;
    data["finalPrice"] = client.products.finalPrice;
    data["paymentMethod"] = client.paymentMethod;
    data["installments"] = client.products.installments;
    data["installmentPrice"] = client.products.installmentPrice;
    data["day"] = client.contracts[0].generateDate.day;
    data["month"] = client.contracts[0].generateDate.month;
    data["year"] = client.contracts[0].generateDate.year;

    return data;
};

function renderHtml(dataToReplace) {
    return new Promise(resolve => {
        fs.readFile(htmlModelPath, { encoding: "utf8" }, (error, data) => {
            if (error) throw error;
            const html = ejs.render(data, dataToReplace);

            fs.writeFile(htmlResultPath, html, () => {
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
            const ejsFile = fs.readFileSync(htmlResultPath, "utf8");
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