const mongoose = require('mongoose')


const MeteringSchema = mongoose.Schema({
    whoCreatedIt: String,
    contractNumber: String,
    customerId: String,
    propertyId: {
        type: String,
        required: [true, "Property ID is required"]
    },

    beforeInstallationImage: String,
    afterInstallationImage: String,
    meterAddress: String,
    meterPosition: String,
    meterCondition: String,
    customerAuthenticate: String,
    meterType: {
        type: String,
        required: [true, "Meter type is required"]
    },
    meterNumber: {
        type: String,
        required: [true, "Meter number is required"]
    },
    meterModel: String,
    phase: {
        type: String,
        required: [true, "Meter phase is required"]
    },
    meterOwner: String,
    meterProvider: {
        type: String,
        required: [true, "Meter provider is required"]
    },
    customerName: {
        type: String,
        required: [true, "Customer name is required"]
    },
    customerPhone: {
        type: String,
        required: [true, "Customer phone number is required"]
    },
    cartonNumber: {
        type: String,
        required: [true, "Carton number is required"]
    },
    meterSeal: {
        type: String,
        required: [true, "Meter seal is required"]
    },

    batchId: {
        type: String,
        required: [true, "Batch id is required"]
    },
    contractNumber: String,
    meterInstallationDate: String,
    installerName: String,
    installerVendor: String,
    installerPhone: String,
    installerId: String,
    serviceCenter: String,
    office: String,
    region: String,
    googleMapCoords: String,
    locationCoords: String,
    lastVendingDate: String,
    lastVendingAmount: Number,
    lastVendingUnit: Number,
    backBilledBefore: Boolean,
    backBilledUnit: Number,
    backBilledAmount: Number,
    backBilledDate: Number,
    installationStatus: {
        type: Boolean,
        default: false
    },

    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'property'
    },
    completionStatus: {
        type: Boolean,
        default: false
    },
    propertyImage: String,
    transformerName: String
})

MeteringSchema.pre('save', async function(){
    const property = await this.model('property').findOne({ propertyId: this.propertyId })
    this.meterAddress = property.buidlingAddress
    this.region = property.region
    this.office = property.office
    this.serviceCenter = property.serviceCenter
    this.googleMapCoords = property.googleMapCoords
    this.locationCoords = property.locationCoords
    this.propertyImage = property.propertyImage;
    this.customerId = property.customerId,
    this.transformerName = property.transformerName,
    this.customer = property.customer
   
    await this.model('property').findByIdAndUpdate(property._id, {
        connectionType: 'Metered'
    })

    if(this.beforeInstallationImage && this.afterInstallationImage && this.meterPosition){
        this.completionStatus = true
    }
})


module.exports = mongoose.model('metering', MeteringSchema);