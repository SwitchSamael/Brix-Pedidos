"use strict";

import SelectedItemsController from "./selectedItems.js";
import { SelectedItems as selectedItemsModel } from "../model/selectedItems.js";

export default class Table {
    constructor(tableId, home) {
        this.tableElement = document.getElementById(tableId);
        this.tableElement.innerHTML = "";

        this.tableHead = document.createElement("thead");
        this.tableBody = document.createElement("tbody");

        this.checkboxList = { "row": [], "column": [] };

        this.tableElement.appendChild(this.tableHead);
        this.tableElement.appendChild(this.tableBody);

        this.selectedItemsContainer = document.querySelector("#selectedItems tbody");

        this.selectedItemsModel = new selectedItemsModel();
        this.selectedItemsController = new SelectedItemsController(home, this);
    };

    write(rows) {
        return new Promise(async resolve => {
            await rows.forEach((row, rowIndex) => {
                const rowElementBody = document.createElement("tr");
                rowElementBody.id = "row_" + rowIndex;

                if (rowIndex < 1) {
                    let rowElementHead = document.createElement("tr");

                    row.forEach(cell => {
                        this.insertCell(cell, null, rowElementHead, rowIndex);
                    });
                } else {
                    row.forEach((cell, cellIndex) => {
                        this.insertCell(cell, cellIndex, rowElementBody, rowIndex);
                    });
                };
            });

            resolve();
        });
    };

    insertCell(cell, cellIndex, rowElement, rowIndex) {
        rowElement.classList.add("text-center");

        let cellElement;
        if (cell.type) {
            cellElement = document.createElement(cell.type);
        } else {
            cellElement = document.createElement("td");
        };

        cellElement.setAttribute("data-cell", cellIndex);

        switch (cell.element) {
            case "checkbox": {
                let checkbox;

                if (cell.name === "automaticService") {
                    checkbox = this.createCheckbox(rowIndex, this.automaticServiceInputListener, cell.disabled);
                } else {
                    checkbox = this.createCheckbox(rowIndex, null, cell.disabled);
                };

                cellElement.appendChild(checkbox);
            } break;

            case "input": {
                let input;
                if (cell.name === "manualService") {
                    input = this.createInputText(rowIndex, this.manualServiceInputListener, cell.disabled);
                    cellElement.appendChild(input);

                } else if (cell.name === "quantity") {
                    input = this.createInputText(rowIndex, this.quantityInputListener, cell.disabled);
                    cellElement.appendChild(input);
                };
            } break;

            case "text": {
                cellElement.innerHTML = cell.content;
            } break;

            default: {
                cellElement.innerHTML = cell;
            };
        };

        rowElement.appendChild(cellElement);
        this.tableBody.appendChild(rowElement);
    };

    createCheckbox(rowIndex, listener = null, disabled) {
        const checkbox = document.createElement("input");

        if (listener) {
            checkbox.addEventListener("click", () => {
                listener(checkbox, this);
            });
        };

        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "custom-check-danger");

        if (disabled) {
            checkbox.setAttribute("disabled", true);
        };

        if (rowIndex === 0) this.checkboxList.column.push(checkbox);
        else this.checkboxList.row.push(checkbox);

        return checkbox;
    };

    createInputText(rowIndex, listener, disabled) {
        const input = document.createElement("input");
        input.id = "inputRow" + rowIndex;
        input.type = "number";
        input.min = 0;
        input.classList.add("form-control", "custom-check-danger");
        input.style.width = "4rem";
        input.style.padding = "5px";

        if (disabled) {
            input.setAttribute("disabled", true);
        };

        input.addEventListener("input", () => { listener(input, this) });

        return input;
    };

    clearRow(row) {
        const automaticServiceCheckbox = row.children[0].children[0];
        const manualServiceInput = row.children[1].children[0];
        const quantityInput = row.children[2].children[0];

        automaticServiceCheckbox.checked = false;
        automaticServiceCheckbox.disabled = true;

        manualServiceInput.disabled = true;
        manualServiceInput.value = "";

        quantityInput.value = "";

        row.style.backgroundColor = "initial";
    };

    automaticServiceInputListener(checkbox, table) {
        const row = checkbox.parentElement.parentElement;
        const rowId = row.id;
        const automaticServiceCheckbox = row.children[0].children[0];
        const manualServiceInput = row.children[1].children[0];
        const selectedItemObject = table.selectedItemsModel.getSelectedItemByRowId(rowId);

        if (automaticServiceCheckbox.checked) {
            manualServiceInput.value = "";
            selectedItemObject.service = "automatic";
        } else {
            selectedItemObject.service = "";
        };

        table.selectedItemsController.updateSelectedItemsContainer();
    };

    manualServiceInputListener(input, table) {
        const row = input.parentElement.parentElement;
        const rowId = row.id;
        const automaticServiceCheckbox = row.children[0].children[0];
        const manualServiceInput = row.children[1].children[0];
        const manualServicePrice = Number(input.value);
        const selectedItemObject = table.selectedItemsModel.getSelectedItemByRowId(rowId);

        if (manualServicePrice === 0 || manualServicePrice === "") {
            manualServiceInput.value = "";
            selectedItemObject.service = null;
        } else {
            automaticServiceCheckbox.checked = false;
            selectedItemObject.service = "manual";
            selectedItemObject.manualServicePrice = manualServicePrice;
        };

        table.selectedItemsController.updateSelectedItemsContainer();
    };

    quantityInputListener(input, table) {
        let row = input.parentElement.parentElement;

        const rowId = row.id;
        const automaticServiceCheckbox = row.children[0].children[0];
        const manualServiceInput = row.children[1].children[0];
        const quantity = Number(input.value);
        const id = row.children[3].innerText;

        if (quantity === 0 || quantity === "") {
            table.clearRow(row);

            let selectedItemObject = table.selectedItemsModel.getSelectedItemByRowId(rowId);

            if (selectedItemObject) {
                table.selectedItemsModel.deleteItem(selectedItemObject);
            };
        } else {
            row.style.backgroundColor = "#ccc";

            automaticServiceCheckbox.disabled = false;
            manualServiceInput.disabled = false;

            const description = row.children[6].innerText;
            const originalPrice = Number(row.children[9].innerText.split(" ")[0]);

            let selectedItemObject = table.selectedItemsModel.getSelectedItemByRowId(rowId);
            if (selectedItemObject) {
                selectedItemObject.quantity = quantity;
            } else {
                table.selectedItemsModel.addItem(id, rowId, quantity, description, null, originalPrice);
            };
        };

        table.selectedItemsController.updateSelectedItemsContainer();
    };

    setFinalPrice(finalPrice) {
        this.selectedItemsModel.finalPrice = parseFloat(finalPrice);
    };

    setFees(fees) {
        this.selectedItemsModel.fees = parseFloat(fees);
    };

    setFeesRate(feesRate) {
        this.selectedItemsModel.feesRate = parseFloat(feesRate);
    };

    getFees() {
        return this.selectedItemsModel.fees;
    };

    getFeesRate() {
        return this.selectedItemsModel.feesRate;
    };

    getAllSelectedItemsObject() {
        return this.selectedItemsModel.items;
    };

    getSelectedItemsObject() {
        return this.selectedItemsModel;
    };

    getTotalPrice() {
        return this.selectedItemsModel.getCapitalPrice().toFixed(2);
    };

    getFinalPrice() {
        return this.selectedItemsModel.getFinalPrice().toFixed(2);
    };

    changeItemsDiscount(hasDiscount, installments = 0) {
        this.selectedItemsModel.hasDiscount = hasDiscount;
        this.selectedItemsModel.installments = parseInt(installments);
    };

    getInstallments() {
        return this.selectedItemsModel.installments;
    };

    getInstallmentPrice() {
        return this.selectedItemsModel.getInstallmentPrice();
    };
};
