"use strict";

import selectedItemsController from "./selectedItems.js";
import { SelectedItems as SelectedItemsModel } from "../model/selectedItems.js";

let tableElement;
let tableHead;
let tableBody;
var checkboxList;

const selectedItemsContainer = document.querySelector("#selectedItems tbody");
const selectedItemsModel = new SelectedItemsModel();

function initialConfig(tableId) {
    tableElement = document.getElementById(tableId);
    tableElement.innerHTML = "";

    tableHead = document.createElement("thead");
    tableBody = document.createElement("tbody");

    checkboxList = { "row": [], "column": [] };

    tableElement.appendChild(tableHead);
    tableElement.appendChild(tableBody);
};

function writeTable(rows, tableId) {
    initialConfig(tableId);

    return new Promise(async resolve => {
        await rows.forEach((row, rowIndex) => {
            const rowElementBody = document.createElement("tr");
            rowElementBody.id = "row_" + rowIndex;

            if (rowIndex < 1) {
                let rowElementHead = document.createElement("tr");

                row.forEach(cell => {
                    insertCell(cell, null, rowElementHead, rowIndex);
                });
            } else {
                row.forEach((cell, cellIndex) => {
                    insertCell(cell, cellIndex, rowElementBody, rowIndex);
                });
            };
        });

        resolve();
    });


    function insertCell(cell, cellIndex, rowElement, rowIndex) {
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
                const checkbox = createCheckbox(rowIndex, null, cell.disabled);
                cellElement.appendChild(checkbox);
            } break;

            case "input": {
                let input;
                if (cell.name === "manualService") {
                    input = createInputText(rowIndex, manualServiceInputListener, cell.disabled);
                    cellElement.appendChild(input);

                } else if (cell.name === "quantity") {
                    input = createInputText(rowIndex, quantityInputListener, cell.disabled);
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
        tableBody.appendChild(rowElement);
    };

    function createCheckbox(rowIndex, listener = null, disabled) {
        const checkbox = document.createElement("input");

        if (listener) {
            checkbox.addEventListener("click", e => {
                e.preventDefault();
                const automaticServiceCheckbox = e.target;
                const rowId = automaticServiceCheckbox.parentElement.parentElement.id

                // Change the checked attribute of the checkbox of the selected items container to the same checkbox of the main table
                Array.from(selectedItemsContainer.children).forEach(selectedItemElement => {
                    const selectedItemCheckbox = selectedItemElement.children[5].children[0];

                    if (selectedItemElement.getAttribute("data-rowId") === rowId) {
                        selectedItemCheckbox.checked = automaticServiceCheckbox.checked;

                        const selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);
                        selectedItemObject["automaticService"] = selectedItemCheckbox.checked;
                        selectedItemsController.updateSelectedItemsContainer();
                    };
                });

            });
        };

        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "custom-check-danger");

        if (disabled) {
            checkbox.setAttribute("disabled", true);
        };

        if (rowIndex === 0) checkboxList.column.push(checkbox);
        else checkboxList.row.push(checkbox);

        return checkbox;
    };

    function createInputText(rowIndex, listener, disabled) {
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

        input.addEventListener("input", listener);

        return input;
    };
};

function clearRow(row) {
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

function automaticServiceInputListener(e) {
    const row = e.target.parentElement.parentElement;
    const rowId = row.id;
    const automaticServiceCheckbox = row.children[0].children[0];
    const manualServiceInput = row.children[1].children[0];
    const selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);

    if (automaticServiceCheckbox.checked) {
        manualServiceInput.value = "";
        selectedItemObject.service = "automatic";
    } else {
        selectedItemObject.service = "";
    };

    selectedItemsController.updateSelectedItemsContainer();
};

function manualServiceInputListener(e) {
    const input = e.target;
    const row = e.target.parentElement.parentElement;
    const rowId = row.id;
    const automaticServiceCheckbox = row.children[0].children[0];
    const manualServiceInput = row.children[1].children[0];
    const manualServicePrice = Number(input.value);
    const selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);

    if (manualServicePrice === 0 || manualServicePrice === "") {
        manualServiceInput.value = "";
        selectedItemObject.service = null;
    } else {
        automaticServiceCheckbox.checked = false;
        selectedItemObject.service = "manual";
        selectedItemObject.manualServicePrice = manualServicePrice;
    };

    selectedItemsController.updateSelectedItemsContainer();
};

function quantityInputListener(e, element) {
    let input;
    let row;

    if (element) {
        input = element;
        row = element.parentElement.parentElement;
    } else {
        input = e.target;
        row = e.target.parentElement.parentElement;
    };

    const rowId = row.id;
    const automaticServiceCheckbox = row.children[0].children[0];
    const manualServiceInput = row.children[1].children[0];
    const quantity = Number(input.value);
    const id = row.children[3].innerText;

    if (quantity === 0 || quantity === "") {
        clearRow(row);

        let selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);

        if (selectedItemObject) {
            selectedItemsModel.deleteItem(selectedItemObject);
        };
    } else {
        row.style.backgroundColor = "#ccc";

        automaticServiceCheckbox.disabled = false;
        manualServiceInput.disabled = false;

        const description = row.children[6].innerText;
        const originalPrice = Number(row.children[9].innerText.split(" ")[0]);

        let selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);
        if (selectedItemObject) {
            selectedItemObject.quantity = quantity;
        } else {
            selectedItemsModel.addItem(id, rowId, quantity, description, null, originalPrice);
        };
    };

    selectedItemsController.updateSelectedItemsContainer();
};

function setFinalPrice(finalPrice) {
    selectedItemsModel.finalPrice = parseFloat(finalPrice);
};

function setFees(fees) {
    selectedItemsModel.fees = parseFloat(fees);
};

function setFeesRate(feesRate) {
    selectedItemsModel.feesRate = parseFloat(feesRate);
};

function getFees() {
    return selectedItemsModel.fees;
};

function getFeesRate() {
    return selectedItemsModel.feesRate;
};

function getAllSelectedItemsObject() {
    return selectedItemsModel.items;
};

function getSelectedItemsObject() {
    return selectedItemsModel;
};

function getTotalPrice() {
    return selectedItemsModel.getCapitalPrice().toFixed(2);
};

function getFinalPrice() {
    return selectedItemsModel.getFinalPrice().toFixed(2);
};

function changeItemsDiscount(hasDiscount, installments = 0) {
    selectedItemsModel.hasDiscount = hasDiscount;
    selectedItemsModel.installments = parseInt(installments);
};

function getInstallments() {
    return selectedItemsModel.installments;
};

function getInstallmentPrice() {
    return selectedItemsModel.getInstallmentPrice();
};

const table = {
    writeTable,
    selectedItemsContainer,
    selectedItemsModel,
    quantityInputListener,
    automaticServiceInputListener,
    setFinalPrice,
    setFees,
    setFeesRate,
    getFees,
    getFeesRate,
    getAllSelectedItemsObject,
    getSelectedItemsObject,
    getTotalPrice,
    getFinalPrice,
    changeItemsDiscount,
    getInstallments,
    getInstallmentPrice,
    checkboxList
};

export default table;