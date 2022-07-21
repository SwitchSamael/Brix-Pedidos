"use strict";

let table;
let tableHead;
let tableBody;
let checkboxList;
const selectedItemsObjectList = [];
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

//Remove focus after 2 seconds
// let allButtons = document.getElementsByClassName("btn");
// [...allButtons].forEach(btn => {
//     btn.addEventListener("click", (e) => {
//         console.log(e.target)
//     })
// })

function writeTable(rows, tableId,

    defaultTable = true
    // bothCheckbox,
    // leftCheckbox,
    // topCheckbox,
    // bothIndex,
    // leftIndex,
    // topIndex,
    // inputColumn

) {
    initialConfig(tableId);
    let oldPrice = 0;

    // if (defaultTable) {
    //     console.log(123)
    //     leftCheckbox, topCheckbox, inputColumn = false;
    // };

    // if (bothCheckbox) {
    //     leftCheckbox, topCheckbox = true;
    // };

    // if (bothIndex) {
    //     leftIndex, topIndex = true;
    // };

    return new Promise(async resolve => {
        await rows.forEach((row, rowIndex) => {
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
        // rowElement.setAttribute("data-align", "center");

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
            // Insert service column
            if (rowIndex === 0 && cellIndex === 0) {
                insertCell(rowElement, "Serviço", "th", null, null);
            } else if (cellIndex === 0) {
                insertCell(rowElement, "", "td", null, null, "checkbox", true);
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
                oldPrice = Number(cellContent);
                cellElement.innerHTML = oldPrice + " R$";
            };

            // Insert price column
            if (rowIndex === 0 && cellIndex === 6) {

                insertCell(rowElement, "Preço", "th", null, null);
            } else if (cellIndex === 6) {
                const off30 = oldPrice + (oldPrice * 0.3);
                const newPrice = (off30 + (off30 * 0.3)).toFixed(2) + " R$";
                insertCell(rowElement, newPrice, "td", null, null);
            };
        };

    };

    function createCheckbox(rowIndex, listener = false) {
        const checkbox = document.createElement("input");
        if (listener) {
            checkbox.addEventListener("click", e => {
                const checkbox = e.target;
                const rowId = checkbox.parentElement.parentElement.id

                // Change the checked attribute of the checkbox of the selected items container to the same checkbox of the main table
                Array.from(selectedItemsContainer.children).forEach(selectedItemElement => {
                    const associatedCheckbox = selectedItemElement.children[5].children[0];

                    if (selectedItemElement.getAttribute("data-rowId") === rowId) {
                        associatedCheckbox.checked = checkbox.checked;

                        const selectedItemObject = checkIfSelectedItemAlreadyExists(null, rowId);
                        selectedItemObject["service"] = associatedCheckbox.checked;
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
    const selectedItemObject = checkIfSelectedItemAlreadyExists(null, rowId);
    selectedItemObject["service"] = isService;
    updateSelectedItemsContainer();
};

function deleteItem(rowId) {
    const inputElement = document.getElementById(rowId).children[2].children[0];
    inputElement.value = 0;
    inputListener(null, inputElement);
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
    const serviceCheckbox = row.children[1].children[0];
    const amount = Number(input.value);
    const id = row.children[3].innerText;

    if (amount === 0 || amount === "") {
        const selectedItemObject = checkIfSelectedItemAlreadyExists(id);
        const selectedItemObjectListIndex = selectedItemsObjectList.indexOf(selectedItemObject);
        selectedItemsObjectList.splice(selectedItemObjectListIndex, 1);
        input.value = "";
        checkbox.checked = false;
        serviceCheckbox.checked = false;
        serviceCheckbox.disabled = true;
    } else {
        checkbox.checked = true;
        serviceCheckbox.disabled = false;

        const description = row.children[6].innerText;
        const oldPrice = Number(row.children[9].innerText.split(" ")[0]);
        const unitPrice = Number(row.children[10].innerText.split(" ")[0]);

        let selectedItemObject;
        if (selectedItemObject = checkIfSelectedItemAlreadyExists(id)) {
            selectedItemObject.amount = amount;
        } else {
            selectedItemsObjectList.push({
                id, rowId, amount, description, unitPrice, oldPrice,
                getTotalPrice: function () {
                    if (this.service) {
                        const plus40percent = (this.oldPrice + this.oldPrice * 0.4);
                        const total = (plus40percent + plus40percent * 0.6);
                        this.totalPrice = Number((this.amount * total).toFixed(2));
                    } else {
                        this.totalPrice = Number((this.amount * this.unitPrice).toFixed(2));
                    }

                    this.getServicePrice();
                    return this.totalPrice
                },
                getServicePrice() {
                    if (this.service) {
                        this.servicePrice = Number((this.totalPrice - (this.unitPrice * this.amount)).toFixed(2));
                    }
                    else {
                        this.servicePrice = 0;
                    }
                }
            });
        };
    };

    updateSelectedItemsContainer();
};

function checkIfSelectedItemAlreadyExists(id, rowId = null) {
    let filtered;
    if (id) {
        filtered = selectedItemsObjectList.filter(selectedItemObject => selectedItemObject.id === id);
    } else if (rowId) {
        filtered = selectedItemsObjectList.filter(selectedItemObject => selectedItemObject.rowId === rowId);
    };

    if (filtered.length === 1) return filtered[0];
    return false;
};

function updateSelectedItemsContainer() {
    const noItemMessage = document.querySelector("#noSelectedItem");
    selectedItemsContainer.innerHTML = "";


    if (selectedItemsObjectList.length === 0) {
        noItemMessage.classList.remove("visually-hidden");
    } else {
        noItemMessage.classList.add("visually-hidden");
    };

    selectedItemsObjectList.forEach(selectedItemObject => {
        selectedItemsContainer.innerHTML += createSelectedItem(
            selectedItemObject.amount,
            selectedItemObject.description,
            selectedItemObject.getTotalPrice(),
            selectedItemObject.rowId,
            selectedItemObject.service
        );
    });
};

function createSelectedItem(amount, description, totalPrice, rowId, service) {
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
    return selectedItemsObjectList;
};

function getTotalPrice() {
    console.log(selectedItemsObjectList.reduce((previous, current) => {
        console.log(previous)
        console.log(current)
        return previous.getTotalPrice() + current.getTotalPrice();
    }));
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