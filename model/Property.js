const mongoose = require("mongoose");
const moment = require("../utils/moment");

const PropertySchema = mongoose.Schema({
    whoCreatedIt: String,
    contractNumber: String,
    customerId: {
        type: String,
        required: [true, 'Customer ID is required']
    },
    googleMapCoords : String,
    propertyId: String,
    enumerated: {
        type: Boolean,
        default: false
    },
    locationCoords: String,
    propertyImage: String,
    propertyServicePointImage: String,
    distanceFromSubstation: String,
    transformerName: String,
    poleNumber : Number,
    phase: String,
    bookCode: String,
    route: String,
    itinerary: String,
    enumerationStatus: String,
    buildingAddress: String,
    buildingType: String,
    buildingActivity: String,
    buildingUse: String,
    customerType: String,
    needPole: String,
    propertyNeedsSupplied: Boolean,
    requestType: String,
    connectionPossible: String,
    connectionType: String,
    comments: String,
    networkType: String,
    volt: String,
    areaType: String,
    propertyOwnerName: String,
    propertyOwnerContact: String,
    areaCode: String,
    geoCode: String,
    _center: String,    
    serviceCenter: {
        type: String,
        required: [true, "Service Center name is required"]
    },
    office: {
        type: String,
        required: [true, "Office name is required"]
    },
    region: {
        type: String,
        required: [true, "Region name is required"]
    },
    createAtDate: String,
    createAtTime: String,

    completionStatus: {
        type: Boolean,
        default: false
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'customer'
    }

})

PropertySchema.pre("save", async function(){
    this.createAtDate = moment().today
    this.createAtTime = moment().time
    this.customer = await this.model('customer').findOne({customerId: this.customerId}).select('_id');

    if(this.propertyImage && this.propertyServicePointImage && this.googleMapCoords && this.transformerName ){
        this.completionStatus = true

        const code0 = `${this.googleMapCoords.split(",")[0].substr(0,1)}${this.googleMapCoords.split(",")[0].substr(2,1)}`
        const code1 = `${this.googleMapCoords.split(",")[1].substr(0,1)}${this.googleMapCoords.split(",")[1].substr(2,1)}`
        const _Id = Math.ceil(Math.random()*9900+ new Date().getMilliseconds()+new Date().getSeconds())+90000
    
        this._center = `${this.googleMapCoords.split(",")[0].substr(5,3)}${this.googleMapCoords.split(",")[1].substr(5,3)}`
        this.areaCode = `${this.googleMapCoords.split(",")[0].substr(3,2)}${this.googleMapCoords.split(",")[1].substr(3,2)}`
        this.geoCode = `${code0}${code1}`
        this.propertyId = `${_Id}${this._center}`
    }
})

module.exports = mongoose.model("property", PropertySchema)