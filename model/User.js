const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcript = require("bcryptjs");


const UserSchema = mongoose.Schema({
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                "Please enter a valid email address"],
        required: [true, "Email address is required"]
    },
    fname: {
        type: String,
        required: [true, "Employee first name required"]
    },
    lname: {
        type: String,
        required: [true, "Employee last name required"]
    },
    telephone: String,
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    designation: {
        type: String, 
        required: [true, "Employee's designation is required"]
    },
    userName: String,
    staffNumber: {
        type: String,
        required: [true, "Employee ID is required"],
        unique: true
    },
    code: String,
    department: {
        type: String,
        required: [true, "Employee department is required"]
    },
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
    } 
})

UserSchema.pre("save", async function(){
    const salt = await bcript.genSalt(10);
    this.password = await bcript.hash(this.password, salt)
    this.userName = `${this.fname}.${this.lname}`
    this.code = `${this.staffNumber}-${this.userName}-${this.department}`
});

UserSchema.methods.matchPassword = async function(pass){
    return await bcript.compare(pass, this.password)
};

UserSchema.methods.userSignature = function(){
    return jwt.sign({
        id: this._id,
        region: this.region,
        office: this.office,
        serviceCenter: this.serviceCenter,
        designation: this.designation
    }, process.env.SECRET_STRING, {
        expiresIn: 336000
    })
}

module.exports = mongoose.model("user", UserSchema)