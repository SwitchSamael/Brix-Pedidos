class SelectedItem {
    constructor(id, rowId, quantity, description, service, originalPrice) {
        this.id = id;
        this.rowId = rowId;
        this.quantity = quantity;
        this.description = description;
        this.service = service;
        this.originalPrice = originalPrice;
        this.setPresentPrice();
    };

    // Price that comes from the provider
    originalPrice = 0;

    // New price generated with the provider price
    presentPrice = 0;

    // Price of all items
    capital = 0;

    // Price with service
    finalPrice = 0;

    automaticServicePrice = 0;
    manualServicePrice = 0;

    setPresentPrice() {
        const fees30 = this.originalPrice + (this.originalPrice * 0.3);
        this.presentPrice = fees30 + (fees30 * 0.3);
    };

    getPresentPrice() {
        return this.presentPrice;
    };

    static getPresentPrice(originalPrice) {
        const fees30 = originalPrice + (originalPrice * 0.3);
        return fees30 + (fees30 * 0.3);
    };

    getAutomaticServicePrice() {
        const plus40percent = (this.originalPrice + this.originalPrice * 0.4);
        const total = (plus40percent + (plus40percent * 0.6)) * this.quantity;
        this.finalPrice = total;

        this.automaticServicePrice = total - this.getCapitalPrice();

        return total;
    };

    getManualServicePrice() {
        const total = this.getCapitalPrice() + this.manualServicePrice;
        this.finalPrice = total;

        return total;
    };

    getCapitalPrice() {
        this.capital = this.presentPrice * this.quantity;
        return this.capital;
    };

    getFinalPrice() {
        switch (this.service) {
            case "manual": {
                return this.getManualServicePrice();
            };

            case "automatic": {
                return this.getAutomaticServicePrice();
            };

            default: {
                this.finalPrice = this.getCapitalPrice();
                return this.getCapitalPrice();
            }
        };
    };
};