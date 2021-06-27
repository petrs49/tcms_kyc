const mongoose = require('mongoose');


const AccountInfoSchema = mongoose.Schema({
    contractNumber: String,
    completionStatus: Boolean,
    customerId: String,
    accountStatus: Boolean,
    accountNumber: {
        type: String,
        unique: true
    },
    tariffClass: {
        type: String,
        required: [true, 'Tariff Class is required']
    },
    category: {
        type: String,
        required: [true, 'Customer category is required']
    },
    bandDescription: String,
    segment: {
        type: String,
        required: [true, 'Customer segment field is required']
    },
    paymentType: {
        type: String,
        required: [true, 'Payment type field is required']
    },
    billingPeriod: {
        type: String,
        required: [true, 'Billing Period field is required']
    },
    billingType: {
        type: String,
        required: [true, 'Billing Type field is required']
    },
    customerIndicator: {
        type: String,
        required: [true, 'Customer Indicator field is required']
    },
    customerType: {
        type: String,
        required: [true, 'Customer Type field is required']
    },
    region: String,
    office: String,
    serviceCenter: String,
    debtPercentage: String,
    debtProfile: {
        current: Number,
        thirtyOld: Number,
        sixtyOld: Number,
        ninetyOld: Number,
        oneTwentyOld: Number,
        oneFiftyOld: Number,
        totalDebt: Number
    },

    currentMonth: {
        transactions: Number,
        sales: Number,
        saleskWh: Number,
        transactionskWh: Number,
        salesCount: Number,
        transactionsCount: Number,
        lastPaymentDate: String,
        lastPaymentAmount: Number
    },
    transformerName: String,
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'customer'
    }
    
})

AccountInfoSchema.pre('save', async function(){
    const property = await this.model('property').findOne({ customerId: this.customerId })
    this.customer = property.customer;
    this.serviceCenter = property.serviceCenter; this.office = property.office
    this.region = property.region; this.transformerName = property.transformerName;
    const transformer = await this.model('transformer').findOne({ code: property.transformerName })
    this.bandDescription = transformer.bandDescription
    this.accountNumber = Math.ceil(Math.random()*8099999999 + new Date().getMilliseconds() + new Date().getSeconds())+80000000000
    this.completionStatus = true;

    if(this.contractNumber){
        this.accountStatus = true
    }
   
})


module.exports = mongoose.model('account', AccountInfoSchema);