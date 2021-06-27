const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcript = require("bcryptjs");


const InstallerSchema = mongoose.Schema({
    email: {
        type: String,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
                "Please enter a valid email address"],
        required: [true, "Email address is required"]
    },
    fname: {
        type: String,
        required: [true, "Installer first name required"]
    },
    lname: {
        type: String,
        required: [true, "Installer last name required"]
    },
    telephone: {
        type: String,
        required: [true, "Installer Phone Number required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    designation: {
        type: String, 
        default: 'Meter Installer'
    },
    
    code: String,

    passPort: {
        type: String,
        required: [true, "Installer Passport is required"]
    },
    workingExperience: {
        type: String,
        required: [true, "Working Exprecience is required"]
    },
    vendorName: {
        type: String,
        required: [true, "Installer Vendor Name is required"]
    } 
})

InstallerSchema.pre("save", async function(){
    const salt = await bcript.genSalt(10);
    this.password = await bcript.hash(this.password, salt)
    this.userName = `${this.fname}.${this.lname}`
    this.code = `${this.userName}-${this.designation}`
});

InstallerSchema.methods.matchPassword = async function(pass){
    return await bcript.compare(pass, this.password)
};

InstallerSchema.methods.userSignature = function(){
    return jwt.sign({
        id: this._id,
        code: this.code,
        vendor: this.vendorName
    }, process.env.SECRET_STRING, {
        expiresIn: 336000
    })
}

module.exports = mongoose.model("installer", InstallerSchema)