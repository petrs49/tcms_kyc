const mongoose = require("mongoose");

const ServiceOrderSchema = mongoose.Schema({
    workOrderStatus: {
        type: String,
        default: 'Registered'
    },
    responsible: {
        employeeName: String,
        employeeId: String,
        designation: String
    },
    responsible2: {
        employeeName: String,
        employeeId: String,
        designation: String
    },
    serviceOrderType: String,
    specificTask: String,
    dataId: String,
    employeeCode: String,
    employeeCode2: String,
    estimatedResolutionDate: String,
    serviceOrderNo: String,
    assignedDate: String,
    customerId: String
})

ServiceOrderSchema.pre('save', async function(){
    const user = await this.model('user').findOne({ code: this.employeeCode })
    const user1 = await this.model('user').findOne({ code: this.employeeCode2 })
    this.responsible.employeeName = `${user.fname} ${user.lname}`
    this.responsible.employeeId = user.staffNumber
    this.responsible.designation = user.designation
    this.responsible2.employeeName = `${user1.fname} ${user1.lname}`
    this.responsible2.employeeId = user1.staffNumber
    this.responsible2.designation = user1.designation;

    const date = new Date(`${this.assignedDate}`)
    const month =date.getMonth().toString().length <= 1 ? `0${new Date().getMonth()+1}`:date.getMonth();
    const day =date.getDate().toString().length <= 1 ? `0${new Date().getDate()}`:date.getDate();
 
    this.estimatedResolutionDate = `${date.getFullYear()}-${month}-${date.getDate()+3}`
})


module.exports = mongoose.model("orders", ServiceOrderSchema)