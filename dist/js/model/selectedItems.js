class SelectedItems {
    items = [];
    hasDiscount = true;
    discount = 5 / 100;

    // Value of a product in cash payment without fees (quantity * present value)
    capital = 0;

    // The addition Price;
    service = "";

    // loan price (Addition in capital)
    fees = 0;

    // Percentage
    feesRate = 0;

    // Time in month to pay
    installments = 0;

    // Final(amount) value per month
    installmentPrice = 0;

    // Amount price (Total to pay for with fees; Value with discount (case cash payment), or with fees (case installment payment))
    finalPrice = 0;

    paymentMethod = "cash";


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

    getFinalPrice() {
        if (this.hasDiscount) {
            this.paymentMethod = "cash";

            const finalPrice = this.getCapitalPrice() - this.getCapitalPrice() * this.discount;
            this.finalPrice = finalPrice;

            this.fees = 0;
            this.feesRate = 0;
            this.installments = 0;
            this.installmentPrice = 0;

            return this.finalPrice
        };

        this.paymentMethod = "installment";
        this.finalPrice = this.getCapitalPrice();
        return this.getCapitalPrice();
    };

    getInstallmentPrice() {
        const installmentPrice = this.getFinalPrice() / this.installments;
        this.installmentPrice = installmentPrice;
        return installmentPrice;
    };
};