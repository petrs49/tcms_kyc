const path = require('path')
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Property = require("../model/Property");


//route     GET /api/v1/sales
//desc      Get all sales
//access    Private
exports.getProperties = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']

    const properties = await Property.find(queries).select(select);

    res.status(200).json({
        success : true,
       data: properties
    })
})

//route     GET /api/v1/sales
//desc      Get single customer
//access    Private
exports.getProperty = asyncHandler(async(req, res, next) => {
    let queries = { ...req.query };
    let select = queries.select === "" ? "-_id" : queries.select

     // Delete Unwanted Additionals
     delete queries['select']
    const property = await Property.findOne({propertyId: req.params.id}).select(select)

    if(!property){
        return next(new ErrorResponse(`No document match your searching params: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success : true,
       data: property
    })
})

//route     POST /api/v1/sales
//desc      Create sales
//access    Public
exports.createProperty = asyncHandler(async(req, res, next) => {
    const _center = `${req.body.googleMapCoords.split(",")[0].substr(5,3)}${req.body.googleMapCoords.split(",")[1].substr(5,3)}`
    const existing = await Property.findOne({_center})

    if(existing){
        return next(new ErrorResponse('This property already exist', 400))
    }
   
    const property = await Property.create(req.body)

    res.status(201).json({
        success : true,
       data: {msg: "Property Created Successfully...", propertyId: property.propertyId}
    })
})

//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.updateProperty = asyncHandler(async(req, res, next) => {
   let property;

    if(req.params.id.length === 11 ){
        property = await Property.findOne({propertyId: req.params.id})
    }else if( req.params.id.length >= 18){
        property = await Property.findOne({ locationCoords: req.params.id })
    }else{
        return next(new ErrorResponse('No result found', 404))
    }

    await Property.findByIdAndUpdate(property._id, req.body, {
        runValidators: true,
        new: true
    })

    res.status(200).json({
        success : true,
       data: "Property Updated Successfully..."
    })
})


//route     PUT /api/v1/sales
//desc      Create sales
//access    Public
exports.propertyImageUpload = asyncHandler(async(req, res, next) => {
    const time = new Date().getTime()
    let property;

    if(req.params.propertyId.length === 11 ){
        property = await Property.findOne({propertyId: req.params.propertyId})
    }else if( req.params.propertyId.length >= 18){
        property = await Property.findOne({locationCoords: req.params.propertyId})
    }else{
        return next(new ErrorResponse('No result found', 404))
    }

    if(!property){
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

    file.name = `photo_${property._id}_${time}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse('Problem error with file uplaod', 500))
        }

        await Property.findByIdAndUpdate(property._id, {
            propertyImage: file.name
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
exports.propertyServicePointImage = asyncHandler(async(req, res, next) => {
    const time = new Date().getTime()
    const property = await Property.findOne({propertyId: req.params.propertyId})

    if(!property){
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

    file.name = `photo_${property._id}_${time}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err){
            console.error(err)
            return next(new ErrorResponse('Problem error with file uplaod', 500))
        }

        await Property.findByIdAndUpdate(property._id, {
            propertyServicePointImage: file.name
        })
    })

    res.status(201).json({
        success : true,
       data: file.name
    })
})
