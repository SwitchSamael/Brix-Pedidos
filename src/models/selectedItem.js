exports = class SelectedItem {
    constructor(id, rowId, amount, description, automaticService, manualService, originalPrice, totalPrice) {
        this.id = id;
        this.rowId = rowId;
        this.amount = amount;
        this.description = description;
        this.automaticService = automaticService;
        this.manualService = manualService;
        this.originalPrice = originalPrice;
        this.totalPrice = totalPrice;
    };

    automaticServicePrice = null;
    
    manualServicePrice = null;
    manualServicePercentage = null;

    setAutomaticServicePrice() {
        const plus40percent = (this.originalPrice + this.originalPrice * 0.4);
        this.automaticServicePrice = (plus40percent + plus40percent * 0.6);
    };

    setManualServicePrice(percentage) {
        this.manualServicePrice = 1.23;
    };

    getNewPrice() {
        return SelectedItem.getNewPrice(this.originalPrice);
    };

    static getNewPrice(originalPrice) {
        const off30 = originalPrice + (originalPrice * 0.3);
        return off30 + (off30 * 0.3);
    };

    getTotalPrice() {
        if (this.automaticService) {
            this.setAutomaticServicePrice();
            return this.automaticServicePrice.toFixed(2);
        } else if (this.manualService) {
            this.setManualServicePrice();
            return this.manualServicePrice.toFixed(2);
        };

        return (this.getNewPrice() * this.amount).toFixed(2);
    };
};