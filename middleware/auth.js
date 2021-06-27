const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("./async");


exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        process.env.NODE_ENV === "development" ? token = req.headers.authorization.split(" ")[1] : "";
    }else if(req.cookie){
        process.env.NODE_ENV === "production" ? token = req.cookie.token : ""
    };

    if(!token){
        return next(new ErrorResponse("No signature! Access denied", 409))
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_STRING);
        req.user = decoded;

    } catch (error) {
        return next(new ErrorResponse("Authorization failed", 401))
    }
    

    next()
})