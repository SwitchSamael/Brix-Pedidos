class SelectedItems {
    items = [];
    hasDiscount = true;
    discountValue = 5 / 100;
    installments = 0;
    fees;

    addItem(id, rowId, amount, description, service, originalPrice) {
        this.items.push(new SelectedItem(id, rowId, amount, description, service, originalPrice));
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

    // getTotalPrice() {
    //     let total = 0;

    //     this.items.forEach(item => {
    //         total += item.getFinalPrice();
    //     });

    //     return total;
    // };

    getTotalPrice() {
        let total = 0;
        this.items.forEach(item => {
            total += item.getTotalPrice();
        });

        return total;
    };

    getItemsFinalPrice() {
        let total = 0;
        this.items.forEach(item => {
            total += item.getFinalPrice();
            console.log(item.getFinalPrice());
        });
        
        return total;
    };

    getFinalPrice() {
        if (this.hasDiscount) {
            return this.getItemsFinalPrice() * this.discountValue;
        };

        return getItemsFinalPrice();
    };

    getInstallmentPrice() {
        return this.getFinalPrice() / this.installments;
    };

    getFinalPriceWithoutDiscount() {

    };
};