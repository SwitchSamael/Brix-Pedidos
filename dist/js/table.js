const table = document.querySelector("table");
table.innerHTML = "";

const tableHead = document.createElement("thead");
const tableBody = document.createElement("tbody");

const checkboxList = { "row": [], "column": [] };

table.appendChild(tableHead);
table.appendChild(tableBody);


//Remove focus after 2 seconds
// let allButtons = document.getElementsByClassName("btn");
// [...allButtons].forEach(btn => {
//     btn.addEventListener("click", (e) => {
//         console.log(e.target)
//     })
// })

function writeTable(rows, includeCheckbox = true, defaultTable = true) {
    return new Promise(async resolve => {
        await rows.forEach((row, rowIndex) => {
            const rowElementBody = document.createElement("tr");
            let charCode = 65;
            let firstRepetitionOfColumnName = true;
            let columnNameArray = [String.fromCharCode(charCode)];

            // Insert the table head
            if (includeCheckbox && rowIndex === 0) {

                let rowElementHead = document.createElement("tr");
                insertCell(rowElementHead, "", "th", null, null);
                insertCell(rowElementHead, "", "th", null, null);

                row.forEach(() => {
                    insertCell(rowElementHead, "", "th", rowIndex, null, true);
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


    function insertCell(rowElement, cellContent, type, rowIndex = null, cellIndex = null, isCheckbox = false) {
        rowElement.classList.add("text-center");
        // rowElement.setAttribute("data-align", "center");

        // Insert the checkbox and index of the row (two new cells)
        if (includeCheckbox && cellIndex === 0) {
            insertCell(rowElement, "", "th", null, null, true);
            insertCell(rowElement, rowIndex + 1, "th");
        } else if(rowIndex === 0){
            type = "th";
        }/

        if(defaultTable && cellIndex === 0){
            insertCell(rowElement, "", "td")
        };

        const cellElement = document.createElement(type);

        if (isCheckbox === true) {
            const checkbox = createCheckbox(rowIndex);
            cellElement.appendChild(checkbox);
        } else {
            cellElement.innerHTML = cellContent;
        };

        rowElement.appendChild(cellElement);
        tableBody.appendChild(rowElement);

    };

    function createCheckbox(rowIndex) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("form-check-input", "custom-check-danger");

        if (rowIndex === 0) checkboxList.column.push(checkbox);
        else checkboxList.row.push(checkbox);

        return checkbox;
    };
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