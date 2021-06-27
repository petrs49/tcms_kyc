const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Feeder = require('../model/Feeder');


//route     GET /api/v1/sales
//desc      Get all sales
//access    Private
exports.getFeeders = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']

    const feeder = await Feeder.find(queries).select(select);

    res.status(200).json({
        success : true,
       data: feeder
    })
})

//route     GET /api/v1/sales
//desc      Get single customer
//access    Private
exports.getFeeder = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']
    const feeder = await Feeder.findOne({code: req.params.id}).select(select)

    if(!feeder){
        return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success : true,
       data: feeder
    })
})

//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.createFeeder = asyncHandler(async(req, res, next) => {
    await Feeder.create(req.body);

    res.status(201).json({
        success: true,
        data: "Feeder Created Successfully...",
    })
})

//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.updateFeeder = asyncHandler(async(req, res, next) => {
   const feeder =  await Feeder.findOne({ code: req.params.id })

   if(!feeder){
    return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
}

    await Feeder.findByIdAndUpdate(feeder._id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success : true,
       data: "Feeder Updated Successfully..."
    })
})


//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.feederImageUpload = asyncHandler(async(req, res, next) => {
    const time = new Date().getTime()
    const feeder = await Feeder.findOne({locationCoords: req.params.codeId})

    if(!feeder){
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

    file.name = `photo_${feeder._id}_${time}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse('Problem error with file uplaod', 500))
        }

        await Feeder.findByIdAndUpdate(feeder._id, {
            feederImage: file.name
        })
    })

    res.status(201).json({
        success : true,
       data: file.name
    })
})
