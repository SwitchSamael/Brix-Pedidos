import server from "../communicateWithServer.js";
import loader from "./loaderScreen.js";
import Table from "./tableWriter.js";
import getCurrentDate from "../getDate.js";
import UUID from "../uuid.js";

export default class Home {
    table = new Table("customTable");
};

function writeTable() {
    loader(server.getIntelbrasTableFromServer).then((tableJson) => {
        if (tableJson) {
            table.write(Object.values(tableJson))
                .then(() => {
                    // Add event listener in each checkbox of automatic service column (First column)
                    document.getElementById("tableContainer").style.height = "30rem";
                    [...document.querySelectorAll("[data-cell='0'] input")].forEach(checkbox => {
                        checkbox.addEventListener("click", () => { table.automaticServiceInputListener(checkbox) });
                    });

                });
        } else {
            document.querySelector("table").innerText = "Nenhuma tabela selecionada";
        };
    });
};

// document.querySelector("form").addEventListener("submit", e => {
//     e.preventDefault();
//     tryGenerateDocument();
// });

function autoGrowObservationField(textarea) {
    textarea.style.height = "1px";
    textarea.style.height = textarea.scrollHeight + "px";
};

function changeFormVisibility(show) {
    const form = document.querySelector("#form");

    if (show) {
        form.classList.remove("visually-hidden");
    } else {
        form.classList.add("visually-hidden");
    };
};

fetch("http://192.168.100.20:9999/pdf", {
    method: "get"
}).then(res => res.arrayBuffer())
    .then(data => {
        // document.getElementById("contract").setAttribute("href",
        // URL.createObjectURL(new Blob([data], {type: "application/pdf"})));
    });


function updateInstallmentPayment(text) {
    document.querySelector("#installmentPaymentDropdownToggle").innerText = text;

    const installments = parseInt(text);

    table.changeItemsDiscount(false, installments);
    setInstallmentPriceVisibility(true);
};

function setDropdownVisibility(show, installments = 2) {
    const dropdownToggleButton = document.querySelector("#installmentPaymentDropdownToggle");

    if (show) {
        table.changeItemsDiscount(false, installments);
        dropdownToggleButton.classList.remove("visually-hidden");
        setInstallmentPriceVisibility(true);
        setFeesVisibility(true);
        setFeesRateVisibility(true);
    } else {
        table.changeItemsDiscount(true);
        dropdownToggleButton.classList.add("visually-hidden");
        setInstallmentPriceVisibility(false);
        setFeesVisibility(false);
        setFeesRateVisibility(false);
    };

    updateFormPayment();
};

function updateFormPayment() {
    document.querySelector("#formTotalPrice").value = table.getTotalPrice() + " R$";
    updateFormInstallmentPrice();
    updateFormFinalPrice();
};

function updateFormFinalPrice() {
    document.querySelector("#formFinalPrice").value = table.getFinalPrice();
};

function formFinalPriceListener(formFinalPrice) {
    document.querySelector("#formFinalPrice").setAttribute("min", table.getTotalPrice());

    const feesRate = (formFinalPrice - table.getTotalPrice()) / table.getTotalPrice();
    const fees = formFinalPrice * feesRate;

    table.setFinalPrice(formFinalPrice);

    table.setFees(fees);
    table.setFeesRate(feesRate);

    updateFormInstallmentPrice();
    updateFormFees();
    updateFormFeesRate();
};

function updateFormInstallmentPrice() {
    document.querySelector("#formInstallmentPrice").value = `${table.getInstallments()} x ${table.getInstallmentPrice().toFixed(2)} R$`;
};

function updateFormFees() {
    document.querySelector("#formFees").value = table.getFees().toFixed(3) + " R$";
};

function updateFormFeesRate() {
    document.querySelector("#formFeesRate").value = (table.getFeesRate() * 100).toFixed(3) + " %";
};

function setFeesVisibility(visibility) {
    const feesContainer = document.querySelector("#rowFees");
    const feesElement = document.querySelector("#formFees");

    if (visibility) {
        feesContainer.classList.remove("visually-hidden");
        feesContainer.removeAttribute("disabled");
        feesElement.value = "0.000 R$";
        table.setFees(feesElement.value);
    } else {
        table.setFees(0);
        feesContainer.classList.add("visually-hidden");
        feesContainer.setAttribute("disabled", true);
    };
};

function setFeesRateVisibility(visibility) {
    const feesRateContainer = document.querySelector("#rowFeesRate");
    const feesRateElement = document.querySelector("#formFeesRate");

    if (visibility) {
        feesRateContainer.classList.remove("visually-hidden");
        feesRateContainer.removeAttribute("disabled");
        feesRateElement.value = "0.000 %";
        table.setFeesRate(feesRateElement.value);
    } else {
        table.setFeesRate(0);
        feesRateContainer.classList.add("visually-hidden");
        feesRateContainer.setAttribute("disabled", true);
    };
};

function setInstallmentPriceVisibility(visibility) {
    const installmentPriceContainer = document.querySelector("#rowInstallmentPrice");

    if (visibility) {
        installmentPriceContainer.classList.remove("visually-hidden");
        installmentPriceContainer.removeAttribute("disabled");
        updateFormInstallmentPrice();
    } else {
        installmentPriceContainer.classList.add("visually-hidden");
        installmentPriceContainer.setAttribute("disabled", true);
    };
};

function tryGenerateDocument() {
    let canGenerate = true;

    const selectItemModal = new bootstrap.Modal(document.getElementById("selectItemModal"));
    if (!document.querySelector("#noSelectedItem").classList.contains("visually-hidden")) {
        canGenerate = false;
        // selectItemModal.show();
        alert("Você precisa selecionar pelo menos um item para prosseguir.")
    };

    if (canGenerate) {
        const checkedRadio = document.querySelector("#paymentMethods input[name=radioPayment]:checked");

        const client = {};
        client.id = UUID();
        client.name = document.getElementById("name").value;
        client.houseNumber = Number(document.getElementById("houseNumber").value);
        client.address = document.getElementById("address").value;
        client.city = document.getElementById("city").value;
        client.cep = document.getElementById("cep").value;
        client.district = document.getElementById("district").value;
        client.phoneNumber = document.getElementById("tel").value;
        client.email = document.getElementById("email").value;
        client.observation = document.getElementById("observation").value;
        client.paymentMethod = checkedRadio.value;
        client.totalPrice = parseFloat(document.getElementById("formTotalPrice").value);
        client.finalPrice = parseFloat(document.getElementById("formFinalPrice").value);
        client.products = table.getSelectedItemsObject();
        client.contracts = [{
            id: UUID(),
            generateDate: getCurrentDate(),
            payDate: "",
            cancelDate: "",
            serviceStartDate: "",
            serviceFinishDate: "",
            status: "pending",
        }];

        generateDocument(JSON.stringify(client));
    };
};



function generateDocument(data) {
    // Novo contrato adicionado a sua lista de contratos.
    document.getElementById("contract").src = "./generateContract";

    // sessionStorage.setItem("data", data);
    // window.location.href = "/generateContract";
    // document.querySelector("form").reset();
};

export {
    writeTable,
    autoGrowObservationField,
    updateFormPayment,
    updateInstallmentPayment,
    setDropdownVisibility,
    formFinalPriceListener,
    changeFormVisibility,
    tryGenerateDocument,
};