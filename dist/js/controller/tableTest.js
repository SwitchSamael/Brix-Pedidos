"use strict";

let table;
let tableHead;
let tableBody;
let checkboxList;

const selectedItemsModel = new SelectedItems();
const selectedItemsContainer = document.querySelector("#selectedItems tbody");

const CELL_HEAD = "th";
const CELL_BODY = "td";

function initialConfig(tableId) {
    table = document.getElementById(tableId);
    table.innerHTML = "";

    tableHead = document.createElement("thead");
    tableBody = document.createElement("tbody");

    checkboxList = { "row": [], "column": [] };

    table.appendChild(tableHead);
    table.appendChild(tableBody);
};

function writeTable(rows, tableId, fullTable = false) {
    initialConfig(tableId);

    return new Promise(async resolve => {
        await rows.forEach((row, rowIndex, rowList) => {
            const rowElementBody = document.createElement("tr");
            rowElementBody.id = "row_" + rowIndex;

            if (rowIndex === 0) {
                let rowElementHead = document.createElement("tr");

                row.forEach(cell => {
                    insertCell(cell, CELL_HEAD, rowElementHead);
                });
            } else if (rowIndex <= 2) {
                row.forEach(cell => {
                    insertCell(cell, CELL_BODY, rowElementBody, cell.type);
                });
            };

            function insertCell(cellContent, cellType, rowElement, elementType = "text", listener = false) {
                rowElement.classList.add("text-center");

                const cellElement = document.createElement(cellType);

                switch (elementType) {
                    case "checkbox": {
                        const checkbox = createCheckbox(rowIndex, listener);
                        cellElement.appendChild(checkbox);
                    } break;

                    case "input": {
                        let input;
                        if (cellContent.name === "manualService") {
                            input = createInputText(rowIndex, manualServiceInputListener);
                            cellElement.appendChild(input);

                        } else if (cellContent.name === "amount") {
                            input = createInputText(rowIndex, amountInputListener);
                            cellElement.appendChild(input);
                        };
                    } break;

                    default: {
                        cellElement.innerHTML = cellContent;
                    };
                };

                rowElement.appendChild(cellElement);
                tableBody.appendChild(rowElement);
            };


            // {
            //     let charCode = 65;
            //     let firstRepetitionOfColumnName = true;
            //     let columnNameArray = [String.fromCharCode(charCode)];

            //     // // Insert the table head
            //     if (rowIndex === 0 && 1 === 2) {
            //         let rowElementHead = document.createElement("tr");
            //         rowList.forEach(row => {
            //             insertCell(rowElementHead, "", "th", null, null);
            //         });

            //         row.forEach(() => {
            //             columnNameArray.splice(-1);
            //             columnNameArray.push(String.fromCharCode(charCode));
            //             let columnName = columnNameArray.join("");

            //             insertCell(rowElementHead, columnName, "th", null, null);

            //             charCode++;

            //             // When goes through all letters, goes back increasing the first letter
            //             if (charCode % 91 === 0) {
            //                 charCode = 65;
            //                 columnNameArray = ["A", String.fromCharCode(charCode)];

            //                 if (firstRepetitionOfColumnName) firstRepetitionOfColumnName = false;
            //                 else {
            //                     const charCode = columnNameArray[0].charCodeAt(0);
            //                     columnNameArray[0] = String.fromCharCode(charCode + 1);
            //                 };
            //             };
            //         });
            //     };
            // }

            // const rowElementBody = document.createElement("tr");
            // rowElementBody.id = "row_" + rowIndex;

            // let charCode = 65;
            // let firstRepetitionOfColumnName = true;
            // let columnNameArray = [String.fromCharCode(charCode)];

            // // Insert the table head
            // if (defaultTable && rowIndex === 0) {
            //     let rowElementHead = document.createElement("tr");
            //     insertCell(rowElementHead, "", "th", null, null);
            //     insertCell(rowElementHead, "", "th", null, null);

            //     row.forEach(() => {
            //         insertCell(rowElementHead, "", "th", rowIndex, null, "checkbox");
            //     });

            //     rowElementHead = document.createElement("tr");
            //     insertCell(rowElementHead, "", "th", null, null);

            //     insertCell(rowElementHead, "#", "th", null, null);

            //     row.forEach(() => {
            //         columnNameArray.splice(-1);
            //         columnNameArray.push(String.fromCharCode(charCode));
            //         let columnName = columnNameArray.join("");

            //         insertCell(rowElementHead, columnName, "th", null, null);

            //         charCode++;

            //         // When goes through all letters, goes back increasing the first letter
            //         if (charCode % 91 === 0) {
            //             charCode = 65;
            //             columnNameArray = ["A", String.fromCharCode(charCode)];

            //             if (firstRepetitionOfColumnName) firstRepetitionOfColumnName = false;
            //             else {
            //                 const charCode = columnNameArray[0].charCodeAt(0);
            //                 columnNameArray[0] = String.fromCharCode(charCode + 1);
            //             };
            //         };
            // });
            // };

            // // Insert the table body and index of the row
            // row.forEach((cell, cellIndex) => {
            //     insertCell(rowElementBody, cell, "td", rowIndex, cellIndex);
            // });
        });

        resolve();
    });

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

                        const selectedItemObject = selectedItemsModel.checkIfItemAlreadyExists(null, rowId);
                        selectedItemObject["automaticService"] = selectedItemCheckbox.checked;
                        updateSelectedItemsContainer();
                    };
                });

            });
        };

        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "custom-check-danger");

        if (!fullTable) {
            checkbox.setAttribute("disabled", true);
        };

        if (rowIndex === 0) checkboxList.column.push(checkbox);
        else checkboxList.row.push(checkbox);

        return checkbox;
    };

    function createInputText(rowIndex, listener) {
        const input = document.createElement("input");
        input.id = "inputRow" + rowIndex;
        input.type = "number";
        input.min = 0;
        input.classList.add("form-control", "custom-check-danger");
        input.style.width = "4rem";
        input.style.padding = "5px";

        input.addEventListener("input", listener);

        return input;
    };
};

function clearRow(row) {
    const automaticServiceCheckbox = row.children[0].children[0];
    const manualServiceInput = row.children[1].children[0];
    const amountInput = row.children[2].children[0];

    automaticServiceCheckbox.checked = false;
    automaticServiceCheckbox.disabled = true;

    manualServiceInput.disabled = true;
    manualServiceInput.value = "";

    amountInput.value = "";

    row.style.backgroundColor = "initial";
};

function automaticServiceInputListener(e) {

};

function manualServiceInputListener(e, element) {
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
    const manualServiceInput = row.children[2].children[0];
    const amount = Number(input.value);
    const id = row.children[4].innerText;

    if (amount === 0 || amount === "") {
        clearRow(rowId);

        let selectedItemObject = selectedItemsModel.checkIfItemAlreadyExists(id);

        if (selectedItemObject) {
            selectedItemsModel.deleteItem(selectedItemObject);
        };
    } else {
        checkbox.checked = true;
        automaticServiceCheckbox.disabled = false;
        manualServiceInput.disabled = false;

        const description = row.children[7].innerText;
        const originalPrice = Number(row.children[10].innerText.split(" ")[0]);
        const unitPrice = Number(row.children[11].innerText.split(" ")[0]);

        let selectedItemObject;
        if (selectedItemObject = selectedItemsModel.checkIfItemAlreadyExists(id)) {
            selectedItemObject.amount = amount;
        } else {
            selectedItemsModel.addItem(id, rowId, amount, description, false, null, originalPrice);
        };
    };

    updateSelectedItemsContainer();
};

function amountInputListener(e, element) {
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
    const amount = Number(input.value);
    const id = row.children[3].innerText;

    if (amount === 0 || amount === "") {
        clearRow(row);

        let selectedItemObject = selectedItemsModel.checkIfItemAlreadyExists(id);

        if (selectedItemObject) {
            selectedItemsModel.deleteItem(selectedItemObject);
        };
    } else {
        row.style.backgroundColor = "#ccc";

        automaticServiceCheckbox.disabled = false;
        manualServiceInput.disabled = false;

        const description = row.children[6].innerText;
        const originalPrice = Number(row.children[9].innerText.split(" ")[0]);
        const unitPrice = Number(row.children[10].innerText.split(" ")[0]);

        let selectedItemObject = selectedItemsModel.checkIfItemAlreadyExists(id);
        if (selectedItemObject) {
            selectedItemObject.amount = amount;
        } else {
            selectedItemsModel.addItem(id, rowId, amount, description, false, null, originalPrice);
        };
    };

    updateSelectedItemsContainer();
};

function getSelectedItensObject() {
    return selectedItemsModel.items;
};

function getTotalPrice() {
    return selectedItemsModel.getTotalPrice();
};