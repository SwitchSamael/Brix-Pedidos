class SelectedItems {
    items = [];
    hasDiscount = true;
    discount = 5 / 100;

    // Value of a product in cash payment without fees (quantity * present value)
    capital;

    // The addition Price;
    service;

    // loan price (Addition in capital)
    fees;

    // Percentage
    feesRate = 1;

    // Time in month to pay
    installments = 0;

    // Final(amount) value per month
    installmentPrice;

    // Amount price (Total to pay for with fees; Value with discount (case cash payment), or with fees (case installment payment))
    finalPrice;

    addItem(id, rowId, quantity, description, service, originalPrice) {
        this.items.push(new SelectedItem(id, rowId, quantity, description, service, originalPrice));
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

    getCapitalPrice() {
        let total = 0;
        this.items.forEach(item => {
            total += item.getFinalPrice();
        });

        this.capital = total;

        return total;
    };

    getFinalPrice(posPrice) {
        if (this.hasDiscount) {
            const finalPrice = this.getCapitalPrice() - this.getCapitalPrice() * this.discount;
            this.finalPrice = finalPrice;

            return this.finalPrice
        };

        if (posPrice) {
            return posPrice + posPrice * this.feesRate;
        };

        return this.getCapitalPrice();
    };

    getInstallmentPrice() {
        return this.getFinalPrice() / this.installments;
    };
};