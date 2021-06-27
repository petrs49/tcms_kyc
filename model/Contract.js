const mongoose = require("mongoose");

const ContractSchema = mongoose.Schema({
    contractNumber: String,
    contractRegDate: String,
    contractActivationDate: String,
    contractModificationDate: String,
    contractStatus: String,
    contractTerminationDate: String,
    disconnectionCount: String,
    lastDisconnectionDate: String,
    contractModifiedBy: String,
    contractType: String,
    contractUpload: String,
    whoCreatedIt: String
})


module.exports = mongoose.model("register", ContractSchema)