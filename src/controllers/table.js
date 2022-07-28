// const updateSelectedItemsContainer = require("../controllers/selectedItems");
import { SelectedItems } from "../models/selectedItems.js";

export class Table {
    table;
    tableHead;
    tableBody;
    checkboxList;

    selectedItemsModel = new SelectedItems();
    // selectedItemsContainer = document.querySelector("#selectedItems tbody");

    // initialConfig(tableId) {
    //     this.table = document.getElementById(tableId);
    //     this.table.innerHTML = "";

    //     this.tableHead = document.createElement("thead");
    //     this.tableBody = document.createElement("tbody");

    //     this.checkboxList = { "row": [], "column": [] };

    //     this.table.appendChild(tableHead);
    //     this.table.appendChild(tableBody);
    // };

    generateHTML(table) {
        let header = "";
        let body = "";
        console.log(table)

        let tableBodyElement = "";
        table.forEach(row => {
            tableBodyElement += this.createRowElement(row);
        })

        return tableBodyElement;
    };

    createRowElement(row) {
        let rowElementBody = "";

        row.forEach(cell => {
            rowElementBody += this.createCellElement(cell);
        });

        return `<tr>${rowElementBody}</tr>`
    };

    createCellElement(cell) {
        return `<td>${cell}</td>`;
    };
    // writeTable(rows, tableId) {
    //     this.initialConfig(tableId);


    //     return new Promise(async resolve => {
    //         await rows.forEach((row, rowIndex) => {
    //             const rowElementBody = document.createElement("tr");
    //             rowElementBody.id = "row_" + rowIndex;

    //             if (rowIndex < 1) {
    //                 let rowElementHead = document.createElement("tr");

    //                 row.forEach(cell => {
    //                     insertCell(cell, rowElementHead, rowIndex);
    //                 });
    //             } else {
    //                 row.forEach(cell => {
    //                     insertCell(cell, rowElementBody, rowIndex);
    //                 });
    //             };
    //         });

    //         resolve();
    //     });


    //     function insertCell(cell, rowElement, rowIndex, listener = false) {
    //         rowElement.classList.add("text-center");

    //         let cellElement;
    //         if (cell.type) {
    //             cellElement = document.createElement(cell.type);
    //         } else {
    //             cellElement = document.createElement("td");
    //         };

    //         switch (cell.element) {
    //             case "checkbox": {
    //                 const checkbox = createCheckbox(rowIndex, listener, cell.disabled);
    //                 cellElement.appendChild(checkbox);
    //             } break;

    //             case "input": {
    //                 let input;
    //                 if (cell.name === "manualService") {
    //                     input = createInputText(rowIndex, manualServiceInputListener, cell.disabled);
    //                     cellElement.appendChild(input);

    //                 } else if (cell.name === "quantity") {
    //                     input = createInputText(rowIndex, quantityInputListener, cell.disabled);
    //                     cellElement.appendChild(input);
    //                 };
    //             } break;

    //             case "text": {
    //                 cellElement.innerHTML = cell.content;
    //             } break;

    //             default: {
    //                 cellElement.innerHTML = cell;
    //             };
    //         };

    //         rowElement.appendChild(cellElement);
    //         tableBody.appendChild(rowElement);
    //     };

    //     function createCheckbox(rowIndex, listener = false, disabled) {
    //         const checkbox = document.createElement("input");
    //         if (listener) {
    //             checkbox.addEventListener("click", e => {
    //                 const automaticServiceCheckbox = e.target;
    //                 const rowId = automaticServiceCheckbox.parentElement.parentElement.id

    //                 // Change the checked attribute of the checkbox of the selected items container to the same checkbox of the main table
    //                 Array.from(selectedItemsContainer.children).forEach(selectedItemElement => {
    //                     const selectedItemCheckbox = selectedItemElement.children[5].children[0];

    //                     if (selectedItemElement.getAttribute("data-rowId") === rowId) {
    //                         selectedItemCheckbox.checked = automaticServiceCheckbox.checked;

    //                         const selectedItemObject = this.selectedItemsModel.getSelectedItemByRowId(null, rowId);
    //                         selectedItemObject["automaticService"] = selectedItemCheckbox.checked;
    //                         updateSelectedItemsContainer();
    //                     };
    //                 });

    //             });
    //         };

    //         checkbox.type = "checkbox";
    //         checkbox.classList.add("form-check-input", "custom-check-danger");

    //         if (disabled) {
    //             checkbox.setAttribute("disabled", true);
    //         };

    //         if (rowIndex === 0) checkboxList.column.push(checkbox);
    //         else checkboxList.row.push(checkbox);

    //         return checkbox;
    //     };

    //     function createInputText(rowIndex, listener, disabled) {
    //         const input = document.createElement("input");
    //         input.id = "inputRow" + rowIndex;
    //         input.type = "number";
    //         input.min = 0;
    //         input.classList.add("form-control", "custom-check-danger");
    //         input.style.width = "4rem";
    //         input.style.padding = "5px";


    //         if (disabled) {
    //             input.setAttribute("disabled", true);
    //         };

    //         input.addEventListener("input", listener);

    //         return input;
    //     };
    // };

    // clearRow(row) {
    //     const automaticServiceCheckbox = row.children[0].children[0];
    //     const manualServiceInput = row.children[1].children[0];
    //     const quantityInput = row.children[2].children[0];

    //     automaticServiceCheckbox.checked = false;
    //     automaticServiceCheckbox.disabled = true;

    //     manualServiceInput.disabled = true;
    //     manualServiceInput.value = "";

    //     quantityInput.value = "";

    //     row.style.backgroundColor = "initial";
    // };

    // automaticServiceInputListener(e) {

    // };

    // manualServiceInputListener(e, element) {
    //     // let input;
    //     // let row;

    //     // if (element) {
    //     //     input = element;
    //     //     row = element.parentElement.parentElement;
    //     // } else {
    //     //     input = e.target;
    //     //     row = e.target.parentElement.parentElement;
    //     // };

    //     // const rowId = row.id;
    //     // const checkbox = row.children[0].children[0];
    //     // const automaticServiceCheckbox = row.children[1].children[0];
    //     // const manualServiceInput = row.children[2].children[0];
    //     // const quantity = Number(input.value);
    //     // const id = row.children[4].innerText;

    //     // if (quantity === 0 || quantity === "") {
    //     //     clearRow(rowId);

    //     //     let selectedItemObject = selectedItemsModel.getSelectedItemByRowId(id);

    //     //     if (selectedItemObject) {
    //     //         selectedItemsModel.deleteItem(selectedItemObject);
    //     //     };
    //     // } else {
    //     //     checkbox.checked = true;
    //     //     automaticServiceCheckbox.disabled = false;
    //     //     manualServiceInput.disabled = false;

    //     //     const description = row.children[7].innerText;
    //     //     const originalPrice = Number(row.children[10].innerText.split(" ")[0]);
    //     //     const unitPrice = Number(row.children[11].innerText.split(" ")[0]);

    //     //     let selectedItemObject;
    //     //     if (selectedItemObject = selectedItemsModel.getSelectedItemByRowId(id)) {
    //     //         selectedItemObject.quantity = quantity;
    //     //     } else {
    //     //         selectedItemsModel.addItem(id, rowId, quantity, description, false, null, originalPrice);
    //     //     };
    //     // };

    //     // updateSelectedItemsContainer();
    // };

    // quantityInputListener(e, element) {
    //     let input;
    //     let row;

    //     if (element) {
    //         input = element;
    //         row = element.parentElement.parentElement;
    //     } else {
    //         input = e.target;
    //         row = e.target.parentElement.parentElement;
    //     };

    //     const rowId = row.id;
    //     const automaticServiceCheckbox = row.children[0].children[0];
    //     const manualServiceInput = row.children[1].children[0];
    //     const quantity = Number(input.value);
    //     const id = row.children[3].innerText;

    //     if (quantity === 0 || quantity === "") {
    //         clearRow(row);

    //         let selectedItemObject = this.selectedItemsModel.getSelectedItemByRowId(id);

    //         if (selectedItemObject) {
    //             this.selectedItemsModel.deleteItem(selectedItemObject);
    //         };
    //     } else {
    //         row.style.backgroundColor = "#ccc";

    //         automaticServiceCheckbox.disabled = false;
    //         manualServiceInput.disabled = false;

    //         const description = row.children[6].innerText;
    //         const originalPrice = Number(row.children[9].innerText.split(" ")[0]);
    //         const unitPrice = Number(row.children[10].innerText.split(" ")[0]);

    //         let selectedItemObject = this.selectedItemsModel.getSelectedItemByRowId(id);
    //         if (selectedItemObject) {
    //             selectedItemObject.quantity = quantity;
    //         } else {
    //             this.selectedItemsModel.addItem(id, rowId, quantity, description, false, null, originalPrice);
    //         };
    //     };

    //     updateSelectedItemsContainer();
    // };

    // getSelectedItensObject() {
    //     return this.selectedItemsModel.items;
    // };

    // getTotalPrice() {
    //     return this.selectedItemsModel.getTotalPrice();
    // };
};