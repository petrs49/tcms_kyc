const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Customer = require('../model/Customer');
const Property = require('../model/Property');
const MeterConnection = require('../model/MeterConnection');
const Account = require('../model/AccountInfo');
const AccountInfo = require('../model/AccountInfo');


//method    GET/api/v1/customer
//desc      Get all customer from the db
//access    Private
exports.getCustomers = asyncHandler( async (req, res, next) => { 
    let queries = { ...req.query };
    let select = queries.select === undefined ? "fullName customer" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']

    const customer = await Customer.find(queries).select(select)
    .populate({ path: "property", select: "-_id -customer transformerName"})
    .populate({ path: "metering", select: "-_id -customer meterSeal"})
    .populate({ path: 'account', select: "-_id -customer tariffClass"})
    
    if(customer.length === 0){
        return  next(new ErrorResponse("Customer not found", 404))
    }
    
    res.status(200).json({
        success: true,
        data: customer,
    })
})

//method    GET/api/v1/customer
//desc      Get single customer from the db
//access    Private
exports.getCustomer = asyncHandler( async (req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']
     
    const customer = await Customer.findOne({customerId: req.params.id}).select(select)

    if(!customer){
        return  next(new ErrorResponse("Customer not found", 404))
    }

    res.status(200).json({
        success: true,
        data: customer
    })
})

//method   POST/api/v1/customer
//desc      Create a new customer
//access    Public
exports.createCustomer = asyncHandler( async (req, res, next) => {
    const customer = await Customer.create(req.body)
    res.status(201).json({
        success: true,
        data: {
            msg: "Create customer sucessfully...",
            _id: customer.customerId
        }
    })
})


//method    PUT/api/v1/customer
//desc      Update customer existing profile
//access    Private
exports.updateCustomer = asyncHandler( async (req, res, next) => {
    const customer = await Customer.findOne({customerId: req.params.id});
    
    if(!customer){
        return  next(new ErrorResponse("Customer not found", 404))
    }

    await Customer.findByIdAndUpdate(customer._id, req.body, { runValidators: false, new: true})
    res.status(200).json({
        success: true,
        data: "Customer Profile Updated Successfully..."
    })
})


//method    DELETE/api/v1/customer
//desc      Deletes customer from the db
//access    Private
exports.deleteCustomers = asyncHandler( async (req, res, next) => {
    const customer = await Customer.findOne({customerId: req.params.id});
    const property = await Property.findOne({customerId: req.params.id});
    const meter = await MeterConnection.findOne({customerId: req.params.id});
    const account = await AccountInfo.findOne({customerId: req.params.id});
    
    if(!customer){
        return  next(new ErrorResponse("Customer not found", 404))
    }

    await Customer.findByIdAndRemove(customer._id)
    await Property.findByIdAndRemove(property._id)
    await MeterConnection.findByIdAndRemove(meter._id)
    await AccountInfo.findByIdAndRemove(account._id)

    res.status(200).json({
        success: true,
        data: "Customer delete sucessfully ..."
    })
})
