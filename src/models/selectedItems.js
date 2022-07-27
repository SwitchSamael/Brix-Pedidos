import { SelectedItem } from "./selectedItem.js";

export class SelectedItems {
    items = [];
    hasDiscount = true;
    discountValue = .05;

    addItem(id, rowId, amount, description, automaticService, manualService, originalPrice, unitPrice) {
        this.items.push(new SelectedItem(id, rowId, amount, description, automaticService, manualService, originalPrice, unitPrice));
    };

    deleteItem(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
    };

    getSelectedItemByRowId(rowId) {
        let filtered = this.items.filter(item => item.rowId === rowId);

        if (filtered.length === 1) return filtered[0];
        return false;
    };

    getTotalPrice() {
        let total = 0;

        this.items.forEach(item => {
            total += item.getTotalPrice();
        });

        return total;
    };
};