const mongoose = require("mongoose");
const slugify = require("slugify")


const FeederSchema = mongoose.Schema({
    feederName: {
        type: String,
        required: [true, "Feeder Name is required"]
    },

    feederRating: {
        type: String,
        required: [true, "Feeder description is required"]
    },

    averageHourlySupply: {
        type: String,
        required: [true, "Average hourly supply is required"]
    },

    locationCoords : {
        type : String,
        required : [true, "Coordinate is required"]
    },

    googleMapCoords: {
        type : String,
        required : [true, "Google map coordinate is required"]
    },

    office: {
        type: String,
        required: [true, "Office name is required"]
    },
    region: {
        type: String,
        required: [true, "Region name is required"]
    },

    code: {
        type: String,
        unique: true
    },
    feederAddress: String,
    feederImage: String,
    createdAt: String
})

FeederSchema.pre("save", function(){
    this.createdAt = `${new Date().toLocaleDateString()}-${new Date().toLocaleTimeString()}`
    this.areaCode = `${this.googleMapCoords.split(",")[0].substr(3,2)}${this.googleMapCoords.split(",")[1].substr(3,2)}`
    
    const name = `${this.office.substr(0, 3)} ${this.region.substr(0, 3)} ${this.feederRating}`
    const nam = `${name} ${this.feederName} ${this.areaCode}`.toUpperCase()
    this.code = slugify(nam)
})

module.exports = mongoose.model("feeder", FeederSchema)
