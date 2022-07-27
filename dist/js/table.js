"use strict";

let table;
let tableHead;
let tableBody;
let checkboxList;

const selectedItemsModel = new SelectedItems();
const selectedItemsContainer = document.querySelector("#selectedItems tbody");

function initialConfig(tableId) {
    table = document.getElementById(tableId);

    table.innerHTML = "";

    tableHead = document.createElement("thead");
    tableBody = document.createElement("tbody");

    checkboxList = { "row": [], "column": [] };

    table.appendChild(tableHead);
    table.appendChild(tableBody);

};

function writeTable(rows, tableId, defaultTable = true) {
    initialConfig(tableId);
    let originalPrice = 0;

    return new Promise(async resolve => {
        await rows.forEach((row, rowIndex, rowList) => {
            const rowElementBody = document.createElement("tr");
            rowElementBody.id = "row_" + rowIndex;

            let charCode = 65;
            let firstRepetitionOfColumnName = true;
            let columnNameArray = [String.fromCharCode(charCode)];

            // Insert the table head
            if (defaultTable && rowIndex === 0) {
                let rowElementHead = document.createElement("tr");
                insertCell(rowElementHead, "", "th", null, null);
                insertCell(rowElementHead, "", "th", null, null);

                row.forEach(() => {
                    insertCell(rowElementHead, "", "th", rowIndex, null, "checkbox");
                });

                rowElementHead = document.createElement("tr");
                insertCell(rowElementHead, "", "th", null, null);

                insertCell(rowElementHead, "#", "th", null, null);

                row.forEach(() => {
                    columnNameArray.splice(-1);
                    columnNameArray.push(String.fromCharCode(charCode));
                    let columnName = columnNameArray.join("");

                    insertCell(rowElementHead, columnName, "th", null, null);

                    charCode++;

                    // When goes through all letters, goes back increasing the first letter
                    if (charCode % 91 === 0) {
                        charCode = 65;
                        columnNameArray = ["A", String.fromCharCode(charCode)];

                        if (firstRepetitionOfColumnName) firstRepetitionOfColumnName = false;
                        else {
                            const charCode = columnNameArray[0].charCodeAt(0);
                            columnNameArray[0] = String.fromCharCode(charCode + 1);
                        };
                    };
                });
            };

            // Insert the table body and index of the row
            row.forEach((cell, cellIndex) => {
                insertCell(rowElementBody, cell, "td", rowIndex, cellIndex);
            });
        });

        resolve();
    });


    function insertCell(rowElement, cellContent, cellType, rowIndex = null, cellIndex = null, elementType = "text", listener = false) {
        rowElement.classList.add("text-center");

        // Insert the checkbox and index of the row (two new cells)
        if (cellIndex === 0) {
            if (defaultTable) {
                insertCell(rowElement, "", "th", null, null, "checkbox");
                insertCell(rowElement, rowIndex + 1, "th");
            } else if (rowIndex === 0) {
                // Insert empty cell in first column
                insertCell(rowElement, "", "th", null, null);
            } else {
                // Insert checkbox in first column
                insertCell(rowElement, "", "th", null, null, "checkbox", true);
            };
        };

        if (rowIndex === 0) {
            cellType = "th";
        };

        // Insert new columns (before index)
        if (!defaultTable) {
            // Insert automatic service column
            if (rowIndex === 0 && cellIndex === 0) {
                insertCell(rowElement, "Serviço (Automático)", "th", null, null);
            } else if (cellIndex === 0) {
                insertCell(rowElement, "", "td", null, null, "checkbox", true);
            };

            // Insert manuel service column
            if (rowIndex === 0 && cellIndex === 0) {
                insertCell(rowElement, "Serviço (Manual)", "th", null, null);
            } else if (cellIndex === 0) {
                insertCell(rowElement, "", "td", rowIndex, null, "input");
            };

            // Insert input column
            if (rowIndex === 0 && cellIndex === 0) {
                insertCell(rowElement, "Quantidade", "th", null, null);
            } else if (cellIndex === 0) {
                insertCell(rowElement, "", "td", rowIndex, null, "input");
            };

        };

        const cellElement = document.createElement(cellType);

        if (elementType === "checkbox") {
            const checkbox = createCheckbox(rowIndex, listener);

            cellElement.appendChild(checkbox);
        } else if (elementType === "input") {
            const input = createInputText(rowIndex);
            cellElement.appendChild(input);
        } else {
            cellElement.innerHTML = cellContent;
        };

        rowElement.appendChild(cellElement);
        tableBody.appendChild(rowElement);


        // Insert new columns (after index)
        if (!defaultTable) {

            // Add the money sign in "CE column's cells"
            if (rowIndex !== 0 && cellIndex === 6) {
                originalPrice = Number(cellContent);
                cellElement.innerHTML = originalPrice + " R$";
            };

            // Insert price column
            if (rowIndex === 0 && cellIndex === 6) {

                insertCell(rowElement, "Preço", "th", null, null);
            } else if (cellIndex === 6) {
                const newPrice = SelectedItem.getNewPrice(originalPrice).toFixed(2) + " R$";
                insertCell(rowElement, newPrice, "td", null, null);
            };
        };
    };

    function createCheckbox(rowIndex, listener = false) {
        const checkbox = document.createElement("input");
        if (listener) {
            checkbox.addEventListener("click", e => {
                const automaticServiceCheckbox = e.target;
                const rowId = automaticServiceCheckbox.parentElement.parentElement.id

                // Change the checked attribute of the checkbox of the selected items container to the same checkbox of the main table
                Array.from(selectedItemsContainer.children).forEach(selectedItemElement => {
                    const selectedItemCheckbox = selectedItemElement.children[5].children[0];

                    if (selectedItemElement.getAttribute("data-rowId") === rowId) {
                        selectedItemCheckbox.checked = automaticServiceCheckbox.checked;

                        const selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);
                        selectedItemObject["automaticService"] = selectedItemCheckbox.checked;
                        updateSelectedItemsContainer();
                    };
                });

            });
        };

        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "custom-check-danger");

        if (!defaultTable) {
            checkbox.setAttribute("disabled", true);
        };

        if (rowIndex === 0) checkboxList.column.push(checkbox);
        else checkboxList.row.push(checkbox);

        return checkbox;
    };

    function createInputText(rowIndex) {
        const input = document.createElement("input");
        input.id = "inputRow" + rowIndex;
        input.type = "number";
        input.min = 0;
        input.classList.add("form-control", "custom-check-danger");
        input.style.width = "4rem";
        input.style.padding = "5px";

        input.addEventListener("input", inputListener);

        return input;
    };
};

function changeItemAmount(rowId, amount) {
    const inputElement = document.getElementById(rowId).children[2].children[0];
    inputElement.value = Number(inputElement.value) + amount;
    inputListener(null, inputElement);
};

function changeItemService(rowId, isService) {
    const checkboxServiceElement = document.getElementById(rowId).children[1].children[0];
    checkboxServiceElement.checked = isService;
    const selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);
    selectedItemObject["automaticService"] = isService;
    updateSelectedItemsContainer();
};

function deleteItem(rowId) {
    const manuelServiceInputElement = document.getElementById(rowId).children[2].children[0];
    const amountInputElement = document.getElementById(rowId).children[3].children[0];
    manuelServiceInputElement.value = "";
    amountInputElement.value = 0;
    inputListener(null, amountInputElement);
};

function inputListener(e, element) {
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
    const checkbox = row.children[0].children[0];
    const automaticServiceCheckbox = row.children[1].children[0];
    const amount = Number(input.value);
    const id = row.children[4].innerText;

    if (amount === 0 || amount === "") {
        let selectedItemObject;

        if (selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId)) {
            selectedItemsModel.deleteItem(selectedItemObject);
        };

        input.value = "";
        checkbox.checked = false;
        automaticServiceCheckbox.checked = false;
        automaticServiceCheckbox.disabled = true;
    } else {
        checkbox.checked = true;
        automaticServiceCheckbox.disabled = false;

        const description = row.children[7].innerText;
        const originalPrice = Number(row.children[10].innerText.split(" ")[0]);
        const unitPrice = Number(row.children[11].innerText.split(" ")[0]);

        let selectedItemObject;
        if (selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId)) {
            selectedItemObject.amount = amount;
        } else {
            selectedItemsModel.addItem(id, rowId, amount, description, false, null, originalPrice);
        };
    };

    updateSelectedItemsContainer();
};

function updateSelectedItemsContainer() {
    const noItemMessage = document.querySelector("#noSelectedItem");
    selectedItemsContainer.innerHTML = "";

    if (selectedItemsModel.items.length === 0) {
        noItemMessage.classList.remove("visually-hidden");
    } else {
        noItemMessage.classList.add("visually-hidden");
    };

    selectedItemsModel.items.forEach(selectedItemModel => {
        selectedItemsContainer.innerHTML += createSelectedItemElement(
            selectedItemModel.amount,
            selectedItemModel.description,
            selectedItemModel.getTotalPrice(),
            selectedItemModel.rowId,
            selectedItemModel.service
        );
    });
};

function createSelectedItemElement(amount, description, totalPrice, rowId, service) {
    return `
        <tr class="text-center" data-rowId="${rowId}">
        <td class="selected-item-amount align-middle">${amount} x</td>
        <td class="selected-item-description align-middle">${description}</td>
        <td class="selected-item-total-price align-middle">${totalPrice} R$</td>
        <td class="arrows-container position-relative align-middle">
            <div class="d-flex arrows">
                <div class="arrow arrow_left" data-rowId="${rowId}" onclick="changeItemAmount(this.getAttribute('data-rowId'), -1)"></div>
                <div class="arrow arrow_right" data-rowId="${rowId}" onclick="changeItemAmount(this.getAttribute('data-rowId'), 1)"></div>
            </div>
        </td>
        <td class="align-middle">
            <div class="btn btn-close text-bg-danger" data-rowId="${rowId}" onclick="deleteItem(this.getAttribute('data-rowId'))"></div>
        </td>
        <td class="align-middle">
            <input class="form-check-input" type="checkbox" ${service === true ? "checked" : ""} data-rowId="${rowId}" onclick="changeItemService(this.getAttribute('data-rowId'), this.checked)"></input>
        </td>
    </tr>        
        `;
};

function getSelectedItensObject() {
    return selectedItemsModel.items;
};

function getTotalPrice() {
    return selectedItemsModel.getTotalPrice();
};

function disableScroll() {
    document.querySelector("body").style.overflow = "hidden";
};

function enableScroll() {
    document.querySelector("body").style.overflow = "initial";
};

function showLoaderScreen() {
    document.querySelector("#loader-container").classList.remove("visually-hidden");
};

function hideLoaderScreen() {
    document.querySelector("#loader-container").classList.add("visually-hidden");
};