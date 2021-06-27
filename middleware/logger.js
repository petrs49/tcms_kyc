const logger = (req, res, next ) => {
    console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`.bold+`  status: ${res.statusCode}`.green.bold)

    next()
};

module.exports = logger;