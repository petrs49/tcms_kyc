const mongoose = require("mongoose");


const TransactionSchema = mongoose.Schema({
    jsTransactionDate: String,
    jsTransactionTime: String,
    contractNumber: {
        type: String,
        required: [true, "Customer contract number is required"]
    },

    accountNumber: {
        type: String,
        required: [true, "Account number is required"]
    },

    transactionType: {
        type: String,
        enums: ["Prepayment", "Postpaid", "Vending"],
        required: [true, "Transaction type is required"]
    },

    paymentStatus: String,
    amountPaid: Number,
    equivelentUnit: Number,
    location: Object,
    tariff: Object,
    cashPoint: {
        type: String,
        required: [true, "Paying point is required"]
    },

    vendorName: {
        type: String,
        required: [true, "Vendor Name is required"]
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        required: true
    },

    billing: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
})

TransactionSchema.pre("save", async function() {
   this.jsTransactionDate = new Date().toLocaleDateString();
   this.jsTransactionTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

   const customer = await this.model("customer").findOne({"contract.contractNumber": `${this.contractNumber}`});

   this.location = {
        region: customer.property.region,
        serviceCenter: customer.property.serviceCenter,
        office: customer.property.office,
        contractStatus: customer.contract.contractStatus
    }

    this.tariff = {
        segment: customer.tariff.segment,
        category: customer.tariff.category,
        connectionType: customer.meterConnection.connectionType,
        description: customer.tariff.description
    }

   const prices = {bandD: 24.30, bandB: 45.06, bandA: 47.06, bandC: 39.14}
   let amount, tariff = customer.tariff.description;

    if(tariff === "Band D" || tariff === "Band E"){
        amount = this.amountPaid/(prices.bandD+0.075)
    }

    if(tariff === "Band B"){
        amount = this.amountPaid/(prices.bandB+0.075)
   }

   if(tariff === "Band A"){
        amount = this.amountPaid/(prices.bandA+0.075)
   }

   if(tariff === "Band C"){
        amount = this.amountPaid/(prices.bandC+0.075)
   }

    // this.amountBilled = Math.floor(amount);

    this.equivelentUnit = Math.floor(amount);

})


module.exports = mongoose.model("transaction", TransactionSchema)