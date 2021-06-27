const mongoose = require("mongoose");

const CustomerSchema = mongoose.Schema({
    customerId: {
        type: String,
        unique: true
    },
    fullName: String,
    gender: String,
    identityNumber : String,
    identityType: String,
    title: {
        type: String,
        required: [ true, "Title is required" ]
    },
    maritalStatus: String,
    email: String,
    city: String,
    area: {
        type: String,
        required: [ true, "Area name is required" ]
    },
    street: {
        type: String,
        required: [ true, "Street name is required" ]
    },
    state: String,
    nationality: String,
    phone1: {
        type: String,
        required: [ true, "Telephone 1 field is required" ]
    },
    phone2: String,
    backUpContact: String,
    fax: String,
    fname: {
        type: String,
        required: [ true, "First name is required" ]
    },
    lname: {
        type: String,
        required: [ true, "Last name is required" ]
    },
    completionStatus: {
        type: Boolean,
        default: false
    },
    contractNumber: String
}, { toJSON: { virtuals: true }, toObject: { virtuals: true } })

CustomerSchema.pre('save', function(){
    this.fullName = `${this.title} ${this.fname} ${this.lname}`
    this.customerId = Math.ceil(Math.random()*341039900+ new Date().getMilliseconds() + new Date().getSeconds())+30000000000

    if(this.phone1 && this.street && this.area && this.fullName){
        this.completionStatus = true
    }
    
})


CustomerSchema.virtual("property", {
    ref: "property", 
    localField: "_id",
    foreignField: "customer",
    justOne: true
})

CustomerSchema.virtual("account", {
    ref: "account", 
    localField: "_id",
    foreignField: "customer",
    justOne: true
})

CustomerSchema.virtual("metering", {
    ref: "metering", 
    localField: "_id",
    foreignField: "customer",
    justOne: true
})

module.exports = mongoose.model("customer", CustomerSchema)