const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Account = require("../model/AccountInfo");


//route     GET /api/v1/sales
//desc      Get all sales
//access    Private
exports.getAccounts = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === undefined ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']

    const account = await Account.find(queries).select(select);

    res.status(200).json({
        success : true,
       data: account
    })
})

//route     GET /api/v1/sales
//desc      Get single customer
//access    Private
exports.getAccount = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === undefined ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']
    const account = await Account.findOne({customerId: req.params.id}).select(select)

    if(!account){
        return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success : true,
       data: account
    })
})

//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.createAccount = asyncHandler(async(req, res, next) => {   
    const account = await Account.create(req.body)

    res.status(201).json({
        success : true,
       data: {msg: "Account Created Successfully...", accountId: account.accountNumber}
    })
})

//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.updateAccount = asyncHandler(async(req, res, next) => {
    const account = await Account.findOne({customerId: req.params.id})
    
    await Account.findByIdAndUpdate(account._id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success : true,
       data: "Account Updated Successfully..."
    })
})
