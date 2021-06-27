const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Property = require("../model/Property");
const MeterConnection = require('../model/MeterConnection');


//route     GET /api/v1/sales
//desc      Get all sales
//access    Private
exports.getMeters = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']

    const metering = await MeterConnection.find(queries).select(select);

    if( metering.length === 0 ){
        return next(new ErrorResponse(`Meter not verified, ensure your inputs are correct!`, 404))
    }

 
    res.status(200).json({
        success : true,
       data: metering
    })
})

//route     GET /api/v1/sales
//desc      Get single customer
//access    Private
exports.getMetering = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select'];
    const metering = await MeterConnection.findOne({propertyId: req.params.id}) !== null ?
        await MeterConnection.findOne({propertyId: req.params.id}).select(select) : 
        await MeterConnection.findOne({meterNumber: req.params.id}).select(select)

    if(!metering){
        return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success : true,
       data: metering
    })
})

//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.createMetering = asyncHandler(async(req, res, next) => {
    
   const existing = await Property.findOne({ propertyId: req.body.propertyId })
    if(!existing){
        return next(new ErrorResponse('This customer is not existing', 404))
    }
   
    await MeterConnection.create(req.body)

    res.status(201).json({
        success : true,
       data: "Meter Created Successfully..."
    })
})

//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.createSchedule = asyncHandler(async(req, res, next) => {
    const verified = async () => {
        let result;
            if(req.body.length >= 1){
                let docs = req.body.map( async data  => {
                    let doc, msg;
                    const checked = await MeterConnection.findOne({ propertyId: data.propertyId})
                    
                    if(!checked && data.customerName !== ""){
                        // doc = await MeterConnection.create(data);
                    }else{
                        data.customerName !== "" ?
                        doc = await `This premises with id ${data.propertyId} already has a meter installed`: ""
                    }
                    return  (await doc)
                })

                result = await docs
            }else{
                result = 'You have not uploaded any records'
            }

        return (await result)   
    }
     

    console.log( await verified())
 
     res.status(201).json({
         success : true,
        data: "All records uploaded sucessfully..."
     })
 })

//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.updateMetering = asyncHandler(async(req, res, next) => {
   const metering =  await MeterConnection.findOne({ propertyId: req.params.id })

    await MeterConnection.findByIdAndUpdate(metering._id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success : true,
       data: "Meter Information Updated Successfully..."
    })
})


//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.afterInstallationImageUpload = asyncHandler(async(req, res, next) => {
    const time = new Date().getTime()
    const metering = await MeterConnection.findOne({ propertyId: req.params.propertyId})

    if(!metering){
       return next(new ErrorResponse('No result found', 404))
    }

    if(!req.files){
        return next(new ErrorResponse('Please upload a file', 400))
    }

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400))
    }

    if(file.size > process.env.FILE_LIMIT){
        return next(new ErrorResponse(`Please upload an image less than
         ${process.env.FILE_LIMIT/1000000}MB`, 400))
    }

    file.name = `photo_${metering._id}_${time}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse('Problem error with file uplaod', 500))
        }

        await MeterConnection.findByIdAndUpdate(metering._id, {
            afterInstallationImage: file.name
        })
    })

    res.status(201).json({
        success : true,
       data: file.name
    })
})


//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.beforeInstallationImageUpload = asyncHandler(async(req, res, next) => {
    const time = new Date().getTime()
    const metering = await MeterConnection.findOne({ propertyId: req.params.propertyId})

    if(!metering){
       return next(new ErrorResponse('No result found', 404))
    }

    if(!req.files){
        return next(new ErrorResponse('Please upload a file', 400))
    }

    const file = req.files.file;

    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse('Please upload an image file', 400))
    }

    if(file.size > process.env.FILE_LIMIT){
        return next(new ErrorResponse(`Please upload an image less than
         ${process.env.FILE_LIMIT/1000000}MB`, 400))
    }

    file.name = `photo_${metering._id}_${time}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse('Problem error with file uplaod', 500))
        }

        await MeterConnection.findByIdAndUpdate(metering._id, {
            beforeInstallationImage: file.name
        })
    })

    res.status(201).json({
        success : true,
       data: file.name
    })
})