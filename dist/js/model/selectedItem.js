class SelectedItem {
    constructor(id, rowId, amount, description, service, originalPrice) {
        this.id = id;
        this.rowId = rowId;
        this.amount = amount;
        this.description = description;
        this.service = service;
        this.originalPrice = originalPrice;
    };

    manualServicePrice = 0;

    getAutomaticServicePrice() {
        const plus40percent = (this.originalPrice + this.originalPrice * 0.4);
        return plus40percent + plus40percent * 0.6;
    };

    getNewPrice() {
        return SelectedItem.getNewPrice(this.originalPrice);
    };

    static getNewPrice(originalPrice) {
        const off30 = originalPrice + (originalPrice * 0.3);
        return off30 + (off30 * 0.3);
    };

    getTotalPrice() {
        return this.getNewPrice() * this.amount;
    };

    getFinalPrice() {
        switch (this.service) {
            case "manual": {
                return this.getTotalPrice() + this.manualServicePrice;
            };

            case "automatic": {
                return this.getAutomaticServicePrice() * this.amount;
            };

            default: return this.getTotalPrice();
        };
    };
};