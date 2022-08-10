import server from "../communicateWithServer.js";
import loader from "./loaderScreen.js";
import getCurrentDate from "../getDate.js";
import UUID from "../uuid.js";
import Table from "./table.js";

export default class Home {
    currentClient;

    constructor() {
        this.table = new Table("customTable", this);
    };

    writeTable() {
        loader(server.getIntelbrasTableFromServer).then((tableJson) => {
            if (tableJson) {
                this.table.write(Object.values(tableJson))
                    .then(() => {
                        document.getElementById("tableContainer").style.height = "30rem";
                    });
            } else {
                document.querySelector("table").innerText = "Nenhuma tabela selecionada";
            };
        });
    };

    autoGrowObservationField(textarea) {
        textarea.style.height = "1px";
        textarea.style.height = textarea.scrollHeight + "px";
    };

    changeFormVisibility(show) {
        const form = document.querySelector("#form");

        if (show) {
            form.classList.remove("visually-hidden");
        } else {
            form.classList.add("visually-hidden");
        };
    };

    updateInstallmentPayment(text) {
        document.querySelector("#installmentPaymentDropdownToggle").innerText = text;

        const installments = parseInt(text);

        this.table.changeItemsDiscount(false, installments);
        this.setInstallmentPriceVisibility(true);
    };

    setDropdownVisibility(show, installments = 2) {
        const dropdownToggleButton = document.querySelector("#installmentPaymentDropdownToggle");

        if (show) {
            this.table.changeItemsDiscount(false, installments);
            dropdownToggleButton.classList.remove("visually-hidden");
            this.setInstallmentPriceVisibility(true);
            this.setFeesVisibility(true);
            this.setFeesRateVisibility(true);
        } else {
            this.table.changeItemsDiscount(true);
            dropdownToggleButton.classList.add("visually-hidden");
            this.setInstallmentPriceVisibility(false);
            this.setFeesVisibility(false);
            this.setFeesRateVisibility(false);
        };

        updateFormPayment();
    };

    updateFormPayment() {
        document.querySelector("#formTotalPrice").value = this.table.getTotalPrice() + " R$";
        this.updateFormInstallmentPrice();
        this.updateFormFinalPrice();
    };

    updateFormFinalPrice() {
        document.querySelector("#formFinalPrice").value = this.table.getFinalPrice();
    };

    formFinalPriceListener(formFinalPrice) {
        document.querySelector("#formFinalPrice").setAttribute("min", this.table.getTotalPrice());

        const feesRate = (formFinalPrice - this.table.getTotalPrice()) / this.table.getTotalPrice();
        const fees = formFinalPrice * feesRate;

        this.table.setFinalPrice(formFinalPrice);

        this.table.setFees(fees);
        this.table.setFeesRate(feesRate);

        this.updateFormInstallmentPrice();
        this.updateFormFees();
        this.updateFormFeesRate();
    };

    updateFormInstallmentPrice() {
        document.querySelector("#formInstallmentPrice").value = `${this.table.getInstallments()} x ${this.table.getInstallmentPrice().toFixed(2)} R$`;
    };

    updateFormFees() {
        document.querySelector("#formFees").value = this.table.getFees().toFixed(3) + " R$";
    };

    updateFormFeesRate() {
        document.querySelector("#formFeesRate").value = (this.table.getFeesRate() * 100).toFixed(3) + " %";
    };

    setFeesVisibility(visibility) {
        const feesContainer = document.querySelector("#rowFees");
        const feesElement = document.querySelector("#formFees");

        if (visibility) {
            feesContainer.classList.remove("visually-hidden");
            feesContainer.removeAttribute("disabled");
            feesElement.value = "0.000 R$";
            this.table.setFees(feesElement.value);
        } else {
            this.table.setFees(0);
            feesContainer.classList.add("visually-hidden");
            feesContainer.setAttribute("disabled", true);
        };
    };

    setFeesRateVisibility(visibility) {
        const feesRateContainer = document.querySelector("#rowFeesRate");
        const feesRateElement = document.querySelector("#formFeesRate");

        if (visibility) {
            feesRateContainer.classList.remove("visually-hidden");
            feesRateContainer.removeAttribute("disabled");
            feesRateElement.value = "0.000 %";
            this.table.setFeesRate(feesRateElement.value);
        } else {
            this.table.setFeesRate(0);
            feesRateContainer.classList.add("visually-hidden");
            feesRateContainer.setAttribute("disabled", true);
        };
    };

    setInstallmentPriceVisibility(visibility) {
        const installmentPriceContainer = document.querySelector("#rowInstallmentPrice");

        if (visibility) {
            installmentPriceContainer.classList.remove("visually-hidden");
            installmentPriceContainer.removeAttribute("disabled");
            this.updateFormInstallmentPrice();
        } else {
            installmentPriceContainer.classList.add("visually-hidden");
            installmentPriceContainer.setAttribute("disabled", true);
        };
    };


    async saveContract() {
        const checkedRadio = document.querySelector("#paymentMethods input[name=radioPayment]:checked");

        const client = {};
        client.id = "client-" + UUID();
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
        client.products = this.table.getSelectedItemsObject();

        client.contracts = [{
            id: "contract-" + UUID(),
            generateDate: getCurrentDate(),
            payDate: "",
            cancelDate: "",
            serviceStartDate: "",
            serviceFinishDate: "",
            status: "pending",
        }];

        await server.getNextSerialNumber().then(json => {
            client.contracts[0]["serialNumber"] = json.nextSerialNumber
        });


        this.currentClient = client;
        server.createClient(JSON.stringify(client));

        let generatedContractModal = new bootstrap.Modal("#generatedContractModal")
        generatedContractModal.show();

    };

    downloadContractPDF(data) {
        window.open("/contract/pdf?clientId=" + this.currentClient.id)
        // window.location.href = "/";

        // server.downloadPDFFromClient(this.currentClient.id);
    };
};