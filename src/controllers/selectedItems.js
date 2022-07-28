function createSelectedItemElement(quantity, description, totalPrice, rowId, service) {
    return `
        <tr class="text-center" data-rowId="${rowId}">
        <td class="selected-item-quantity align-middle">${quantity} x</td>
        <td class="selected-item-description align-middle">${description}</td>
        <td class="selected-item-total-price align-middle">${totalPrice} R$</td>
        <td class="arrows-container position-relative align-middle">
            <div class="d-flex arrows">
                <div class="arrow arrow_left" data-rowId="${rowId}" onclick="changeItemQuantity(this.getAttribute('data-rowId'), -1)"></div>
                <div class="arrow arrow_right" data-rowId="${rowId}" onclick="changeItemQuantity(this.getAttribute('data-rowId'), 1)"></div>
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

function deleteItem(rowId) {
    const quantityInputElement = document.getElementById(rowId).children[2].children[0];
    quantityInputElement.value = 0;
    quantityInputListener(null, quantityInputElement);    
};

function changeItemQuantity(rowId, quantity) {
    const quantityInputElement = document.getElementById(rowId).children[2].children[0];
    quantityInputElement.value = Number(quantityInputElement.value) + quantity;
    quantityInputListener(null, quantityInputElement);
};

function changeItemService(rowId, isService) {
    const checkboxServiceElement = document.getElementById(rowId).children[1].children[0];
    checkboxServiceElement.checked = isService;
    const selectedItemObject = selectedItemsModel.getSelectedItemByRowId(rowId);
    selectedItemObject["automaticService"] = isService;
    updateSelectedItemsContainer();
};

function updateSelectedItemsContainer() {
    showHideNoItemMessage();

    selectedItemsModel.items.forEach(selectedItemModel => {
        selectedItemsContainer.innerHTML += createSelectedItemElement(selectedItemModel.quantity, selectedItemModel.description, selectedItemModel.getTotalPrice(), selectedItemModel.rowId, selectedItemModel.service);
    });
};

function showHideNoItemMessage() {
    const noItemMessage = document.querySelector("#noSelectedItem");
    selectedItemsContainer.innerHTML = "";

    if (selectedItemsModel.items.length === 0) {
        noItemMessage.classList.remove("visually-hidden");
    } else {
        noItemMessage.classList.add("visually-hidden");
    };
};