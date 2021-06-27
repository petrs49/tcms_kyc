const mongoose = require("mongoose");

const DisconnectionSchema = mongoose.Schema({
    workOrderStatus: {
        type: String,
        default: 'Registered'
    },
    responsible: {
        employeeName: String,
        employeeId: String,
        designation: String
    },
    serviceOrderType: String,
    specificTask: String,
    dataId: String,
    employeeCode: String,
    estimatedResolutionDate: String,
    serviceOrderNo: String,
    assignedDate: String,
    customerId: String
})

DisconnectionSchema.pre('save', async function(){
    const user = await this.model('user').findOne({ code: this.employeeCode })
    this.responsible.employeeName = `${user.fname} ${user.lname}`
    this.responsible.employeeId = user.staffNumber
    this.responsible.designation = user.designation

    const date = new Date(`${this.assignedDate}`)
    const month =date.getMonth().toString().length <= 1 ? `0${new Date().getMonth()+1}`:date.getMonth();
    const day =date.getDate().toString().length <= 1 ? `0${new Date().getDate()}`:date.getDate();

    this.estimatedResolutionDate = `${date.getFullYear()}-${month}-${date.getDate()+3}`
})


module.exports = mongoose.model("dso", DisconnectionSchema)