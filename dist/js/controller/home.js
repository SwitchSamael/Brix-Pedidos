import server from "../communicateWithServer.js";
import loader from "./loaderScreen.js";
import {
    writeTable,
    automaticServiceInputListener,
    setFees,
    setFeesRate,
    setFinalPrice,
    changeItemsDiscount,
    getFees,
    getFeesRate,
    getSelectedItemsObject,
    getInstallments,
    getInstallmentPrice,
    getTotalPrice,
    getFinalPrice
} from "./table.js";

import getCurrentDate from "../getDate.js";
import UUID from "../uuid.js";

loader(server.getIntelbrasTableFromServer).then((tableJson) => {
    if (tableJson) {
        writeTable(Object.values(tableJson), "customTable", false)
            .then(() => {
                // Add event listener in each checkbox of automatic service column (First column)
                document.getElementById("tableContainer").style.height = "30rem";
                [...document.querySelectorAll("[data-cell='0'] input")].forEach(checkbox => {
                    checkbox.addEventListener("click", automaticServiceInputListener);
                });
            });
    } else {
        document.querySelector("table").innerText = "Nenhuma tabela selecionada";
    };
});

document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault();
    tryGenerateDocument();
});

function autoGrowObservationField(textarea) {
    textarea.style.height = "1px";
    textarea.style.height = textarea.scrollHeight + "px";
};

export function changeFormVisibility(show) {
    const form = document.querySelector("#form");

    if (show) {
        form.classList.remove("visually-hidden");
    } else {
        form.classList.add("visually-hidden");
    };
};

fetch("http://192.168.100.20:9999/pdf", {
    method: "get"
}).then(data => data.)
.then(pdf=>{
    console.log(pdf)
});

function updateInstallmentPayment(text) {
    document.querySelector("#installmentPaymentDropdownToggle").innerText = text;

    const installments = parseInt(text);

    changeItemsDiscount(false, installments);
    setInstallmentPriceVisibility(true);
};

function setDropdownVisibility(show, installments = 2) {
    const dropdownToggleButton = document.querySelector("#installmentPaymentDropdownToggle");

    if (show) {
        changeItemsDiscount(false, installments);
        dropdownToggleButton.classList.remove("visually-hidden");
        setInstallmentPriceVisibility(true);
        setFeesVisibility(true);
        setFeesRateVisibility(true);
    } else {
        changeItemsDiscount(true);
        dropdownToggleButton.classList.add("visually-hidden");
        setInstallmentPriceVisibility(false);
        setFeesVisibility(false);
        setFeesRateVisibility(false);
    };

    updateFormPayment();
};

function updateFormPayment() {
    document.querySelector("#formTotalPrice").value = getTotalPrice() + " R$";
    updateFormInstallmentPrice();
    updateFormFinalPrice();
};

function updateFormFinalPrice() {
    document.querySelector("#formFinalPrice").value = getFinalPrice();
};

function formFinalPriceListener(formFinalPrice) {
    document.querySelector("#formFinalPrice").setAttribute("min", getTotalPrice());

    const feesRate = (formFinalPrice - getTotalPrice()) / getTotalPrice();
    const fees = formFinalPrice * feesRate;

    setFinalPrice(formFinalPrice);

    setFees(fees);
    setFeesRate(feesRate);

    updateFormInstallmentPrice();
    updateFormFees();
    updateFormFeesRate();
};

function updateFormInstallmentPrice() {
    document.querySelector("#formInstallmentPrice").value = `${getInstallments()} x ${getInstallmentPrice().toFixed(2)} R$`;
};

function updateFormFees() {
    document.querySelector("#formFees").value = getFees().toFixed(3) + " R$";
};

function updateFormFeesRate() {
    document.querySelector("#formFeesRate").value = (getFeesRate() * 100).toFixed(3) + " %";
};

function setFeesVisibility(visibility) {
    const feesContainer = document.querySelector("#rowFees");
    const feesElement = document.querySelector("#formFees");

    if (visibility) {
        feesContainer.classList.remove("visually-hidden");
        feesContainer.removeAttribute("disabled");
        feesElement.value = "0.000 R$";
        setFees(feesElement.value);
    } else {
        setFees(0);
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
        setFeesRate(feesRateElement.value);
    } else {
        setFeesRate(0);
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
        client.products = getSelectedItemsObject();
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
    autoGrowObservationField,
    updateFormPayment,
    updateInstallmentPayment,
    setDropdownVisibility,
    formFinalPriceListener,
};