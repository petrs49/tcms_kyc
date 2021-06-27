const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Transformer = require('../model/Transformer');


//route     GET /api/v1/sales
//desc      Get all sales
//access    Private
exports.getTransformers = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']
    
    const transformer = await Transformer.find(queries).select(select);

    res.status(200).json({
        success : true,
       data: transformer
    })
})


//route     GET /api/v1/sales
//desc      Get single customer
//access    Private
exports.getTransformer = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']

    const transformer = await Transformer.findOne({code: req.params.id}).select(select)

    if(!transformer){
        return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success : true,
       data: transformer
    })
})

//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.createTransformer = asyncHandler(async(req, res, next) => {
    await Transformer.create(req.body);
    res.status(201).json({
        success: true,
        data: "Transformer Created Successfully...",
    })
})

//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.updateTransformer = asyncHandler(async(req, res, next) => {
   const transformer =  await Transformer.findOne({ code: req.params.id })

   if(!transformer){
    return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
}

    await Transformer.findByIdAndUpdate(transformer._id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success : true,
       data: "Transformer Updated Successfully..."
    })
})


//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.transformerImageUpload = asyncHandler(async(req, res, next) => {
    const time = new Date().getTime()
    const transformer = await Transformer.findOne({locationCoords: req.params.codeId})

    if(!transformer){
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

    file.name = `photo_${transformer._id}_${time}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse('Problem error with file uplaod', 500))
        }

        await Transformer.findByIdAndUpdate(transformer._id, {
            transformerImage: file.name
        })
    })

    res.status(201).json({
        success : true,
       data: file.name
    })
})
