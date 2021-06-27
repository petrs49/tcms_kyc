const mongoose = require("mongoose");

const BillingSchema = mongoose.Schema({
    jsBillingDate: String,
    jsBillingTime: String,
    billType: {
        type: String,
        required: [true, "Bill Type is required"]
    },

    period: {
        type: String,
        required: [true, "Billing period is required"]
    },

    location: Object,

    billFrom: {
        type: String,
        required: [true, "Billing range is required"]
    },

    billTo: {
        type: String,
        required: [true, "Billing range is required"]
    },

    amountBilled: Number,

    tariffDescription: {
        type: String,
        required: [true, "Tariff Description is required"],
        enums: ["Band A", "Band B", "Band C", "Band E", "Band D"]
    },

    billingType: String,

    lastPaymentDate: String,
    lastPaymentAmount: Number,
    tariff: Object,

    billConsumption: {
        type: Number,
        required: [true, "Bill consumption is required"]
    },

    customer: {
        type: mongoose.Schema.ObjectId,
        ref: "customer",
        required: [true, "Primary key is required"]
    },

    contractNumber: {
        type: String,
        required: [true, "Contract number is required"]
    },

    accountNumber: {
        type: Number,
        required: [true, "Account number is required"]
    }
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

BillingSchema.pre("save", async function() {
    const hour = new Date().getHours().toString().length <= 1 ? `0${new Date().getHours()}`: new Date().getHours();
    const minute = new Date().getMinutes().toString().length <= 1 ? `0${new Date().getMinutes()}`: new Date().getMinutes();
    const seconds = new Date().getSeconds().toString().length <= 1 ? `0${new Date().getSeconds()}`: new Date().getSeconds();
    // **********************************************************************************************************************
    const month = new Date().getMonth().toString().length <= 1 ? `0${new Date().getMonth()}`: new Date().getMonth();
    const day = new Date().getDate().toString().length <= 1 ? `0${new Date().getDate()}`: new Date().getDate();
    const year = new Date().getFullYear();
    
    this.jsBillingTime = `${hour}:${minute}:${seconds}`
    this.jsBillingDate = `${year}-${month}-${day}`;

    const prices = {bandD: 24.30, bandB: 45.06, bandA: 47.06, bandC: 39.14}
    let amount;

     if(this.tariffDescription === "Band D" || this.tariffDescription === "Band E"){
         amount = this.billConsumption * prices.bandD + (this.billConsumption * prices.bandD)*0.075
     }

     if(this.tariffDescription === "Band B"){
        amount = this.billConsumption * prices.bandB + (this.billConsumption * prices.bandB)*0.075
    }

    if(this.tariffDescription === "Band A"){
        amount = this.billConsumption * prices.bandA + (this.billConsumption * prices.bandA)*0.075
    }

    if(this.tariffDescription === "Band C"){
        amount = this.billConsumption * prices.bandC + (this.billConsumption * prices.bandC)*0.075
    }

     this.amountBilled = Math.floor(amount);
    //  this.VAT = Math.floor(amount*0.075);
    //  this.actualAmount = Math.floor(this.amountBilled - this.VAT)

    // ***********************************************************************
    // UPDATE CUSTOMER IMPORTANT INFO
    const customer = await this.model('customer').findOne({"contract.contractNumber": this.contractNumber});

    await this.model("customer").findByIdAndUpdate(customer._id, {
        "account.preBilling": this.billConsumption,
        "account.billingAmount": this.amountBilled
    },
        { runValidators: false, new: true})












});

BillingSchema.virtual("transactions", {
    ref: "transaction", 
    localField: "_id",
    foreignField: "billing",
    justOne: false
})

BillingSchema.pre("save", async function(){
    const transaction = await this.model("transaction").find({contractNumber: `${this.contractNumber}`})
    .sort({"jsTransactionDate": -1})
    .select("-_id")

    this.lastPaymentAmount = transaction.length > 0 ? transaction[0].amountPaid : 0;
    this.lastPaymentDate = transaction.length > 0 ? transaction[0].jsTransactionDate : "";

    const customer = await this.model("customer").findOne({"contract.contractNumber": `${this.contractNumber}`});


   this.location = {
        region: customer.property.region,
        serviceCenter: customer.property.serviceCenter,
        office: customer.property.office
   }
   this.tariff = {
       segment: customer.tariff.segment,
       category: customer.tariff.category,
       connectionType: customer.meterConnection.connectionType
   }

//    Debt Profile Update
        // const currentDebt = this.amountBilled;
        // const upto_30_Days = Number
        // const upto_60_Days = Number
        // const upto_90_Days = Number
        // const upto_120_Days = Number

})



module.exports = mongoose.model("billing", BillingSchema)