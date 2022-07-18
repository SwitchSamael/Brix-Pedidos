"use strict";

let table;
let tableHead;
let tableBody;
let checkboxList;
const selectedItemsObjectList = [];

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


    function insertCell(rowElement, cellContent, cellType, rowIndex = null, cellIndex = null, elementType = "text") {
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
                insertCell(rowElement, "", "th", null, null, "checkbox");
            };
        };

        if (rowIndex === 0) {
            cellType = "th";
        };

        // Insert new columns (before index)
        if (!defaultTable) {
            // Insert input column
            if (rowIndex === 0 && cellIndex === 0) {
                insertCell(rowElement, "Quantidade", "th", null, null);
            } else if (cellIndex === 0) {
                insertCell(rowElement, "", "td", rowIndex, null, "input");
            };
        };

        const cellElement = document.createElement(cellType);

        if (elementType === "checkbox") {
            const checkbox = defaultTable ? createCheckbox(rowIndex) : createCheckbox(rowIndex, true);

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
                const off40 = oldPrice + (oldPrice * 0.4);

                const newPrice = (off40 + (off40 * 0.6)).toFixed(2) + " R$";
                insertCell(rowElement, newPrice, "td", null, null);
            };
        };

    };

    function createCheckbox(rowIndex, disabled = false) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "custom-check-danger");

        if (disabled) {
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
    const inputElement = document.getElementById(rowId).children[1].children[0];
    inputElement.value = Number(inputElement.value) + amount;
    inputListener(null, inputElement);
};

function deleteItem(rowId) {
    const inputElement = document.getElementById(rowId).children[1].children[0];
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
    const amount = input.value;
    const id = row.children[2].innerText;

    if (amount === "0" || amount === "") {
        const selectedItemObject = checkIfSelectedItemAlreadyExists(id)
        const selectedItemObjectListIndex = selectedItemsObjectList.indexOf(selectedItemObject);
        selectedItemsObjectList.splice(selectedItemObjectListIndex, 1);

        input.value = "";

        checkbox.checked = false;
    } else {
        checkbox.checked = true;

        const itemDescription = row.children[5].innerText;
        const price = row.children[9].innerText.split(" ")[0];
        const totalPrice = (amount * price).toFixed(2);

        let selectedItemObject
        if (selectedItemObject = checkIfSelectedItemAlreadyExists(id)) {
            selectedItemObject.amount = amount;
            selectedItemObject.itemDescription = itemDescription;
            selectedItemObject.totalPrice = totalPrice;
        } else {
            selectedItemsObjectList.push({ id, rowId, amount, itemDescription, totalPrice, input });
        };
    };

    updateSelectedItemsContainer();
};

function checkIfSelectedItemAlreadyExists(id) {
    const filtered = selectedItemsObjectList.filter(selectedItemObject => selectedItemObject.id === id);

    if (filtered.length === 1) return filtered[0];
    return false;
};

function updateSelectedItemsContainer() {
    const selectedItemsContainer = document.querySelector("#selectedItems");
    const noItemMessage = document.querySelector("#noSelectedItem");
    selectedItemsContainer.innerHTML = "";


    if(selectedItemsObjectList.length === 0){
        noItemMessage.classList.remove("visually-hidden");
    } else{
        noItemMessage.classList.add("visually-hidden");
    };

    selectedItemsObjectList.forEach(selectedItemObject => {
        selectedItemsContainer.innerHTML += createSelectedItem(
            selectedItemObject.amount,
            selectedItemObject.itemDescription,
            selectedItemObject.totalPrice,
            selectedItemObject.rowId
        );
    });
};

function createSelectedItem(amount, description, totalPrice, rowId) {

    //  `
    //     <div class="d-flex justify-content-evenly" id="${id}">
    //         <div class="selected-item-amount">${amount} x</div>
    //         <div class="selected-item-description">${description} </div>
    //         <div class="selected-item-total-price">${totalPrice} R$</div>
    //         <div class="btn btn-close text-bg-danger" data-itemId="${input}"></div>
    //     </div>`
    return `
        <tr class="text-center">
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
    </tr>        
        `;
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