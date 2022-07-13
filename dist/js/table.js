 const table = document.querySelector("table");

 const tableHead = document.createElement("thead");
 const tableBody = document.createElement("tbody");

 const checkboxList = [];

 table.appendChild(tableHead);
 table.appendChild(tableBody);


 //Remove focus after 2 seconds
 // let allButtons = document.getElementsByClassName("btn");
 // [...allButtons].forEach(btn => {
 //     btn.addEventListener("click", (e) => {
 //         console.log(e.target)
 //     })
 // })

 function sendFileToServer(json) {
     fetch("http://192.168.100.20:9999/file/post", {
         method: "post",
         headers: {
             "Accept": "application/json",
             "Content-Type": "application/json"
         },
         body: JSON.stringify(json)
     });
 };

 function getFileFromServer() {
     fetch("http://192.168.100.20:9999/file/get", { method: "get" })
         .then(response => response.json())
         .then(data => {
             console.log(data)
         });
 };

 function writeTable(rows) {
     rows.forEach((row, rowIndex) => {
         const rowElementBody = document.createElement("tr");

         let charCode = 65;
         let firstRepetitionOfColumnName = true;

         let columnNameArray = [String.fromCharCode(charCode)];

         // Insert the table head
         if (rowIndex === 0) {

             let rowElementHead = document.createElement("tr");
             insertCell(rowElementHead, "", "th", null, null, "head");
             insertCell(rowElementHead, "column_#", "th", null, null, "head", true);

             row.forEach((cell, cellIndex) => {
                 insertCell(rowElementHead, `column_${cellIndex + 1}`, "th", null, null, "head", true);
             });

             rowElementHead = document.createElement("tr");
             insertCell(rowElementHead, "row_#", "th", null, null, "head", true);
             insertCell(rowElementHead, "#", "th", null, null, "head");

             row.forEach((cell, cellIndex) => {
                 columnNameArray.splice(-1);
                 columnNameArray.push(String.fromCharCode(charCode));
                 let columnName = columnNameArray.join("");

                 insertCell(rowElementHead, columnName, "th", null, null, "head");

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
             })
         };

         // Insert the table body and index of the row
         row.forEach((cell, cellIndex) => {
             insertCell(rowElementBody, cell, "td", rowIndex, cellIndex);
         });

     });
     function insertCell(rowElement, cellContent, type, rowIndex = null, cellIndex = null, tableSection = "body", isCheckbox = false) {
         rowElement.classList.add("text-center");
         // rowElement.setAttribute("data-align", "center");

         // Insert the index of the row (a new cell)
         if (cellIndex === 0) {
             insertCell(rowElement, `row_${rowIndex + 1}`, "th", null, null, null, true);
             insertCell(rowElement, rowIndex + 1, "th");
         };

         const cellElement = document.createElement(type);

         if (isCheckbox === true) {
             const checkbox = document.createElement("input");
             checkbox.type = "checkbox";
             checkbox.classList.add("form-check-input", "custom-check-danger");
             cellElement.appendChild(checkbox);
             cellElement.id = cellContent;
             checkbox.id = cellContent;
             checkboxList.push(checkbox);
         } else {
             cellElement.innerHTML = cellContent;
         }
         rowElement.appendChild(cellElement);
         // cellElement.style.backgroundColor =  "rgba(250, 0, 0, .6)";

         switch (tableSection) {
             case "head": {
                 tableHead.appendChild(rowElement);
             } break;

             case "body": {
                 tableBody.appendChild(rowElement);
             } break;
         }
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