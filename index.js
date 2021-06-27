const express = require("express");
const app = express();
const dotenv = require('dotenv');
const path = require('path')
const colors = require('colors');
const cookies = require("cookie-parser")
const cors = require('cors')
const connectDB = require("./config/db");
const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errors");
const customer = require('./routes/customer')
const user = require('./routes/user')
const transformer = require('./routes/transformer')
const property = require('./routes/property')
const feeder = require('./routes/feeder')
const account = require('./routes/account')
const meter = require('./routes/meter')




//Dotenv path
dotenv.config({ path: './config/.env'});

//Connect DB
connectDB();

//Accept customers' input
app.use(express.json({ extended: false }))

// Access uploaded files
app.use(express.static(path.join(__dirname, "public")))


//Middleware
app.use(logger)
app.use(cors())
app.use(cookies())


//Upload an Image
app.post("/upload", (req, res) => {  
    if( !req.files ) {
        return res.status(400).json({msg: 'No file uploaded', success: false})
    }
    const file = req.files.file;
    file.mv(`${__dirname}/public/uploads/${file.name}`, err => {
        if(err){
            console.error(err)
            return res.status(500).send(err)
        }
        res.status(200).json({ fileName: file.name, success: true})
    })
})

//Initialize Routes
app.use("/api/v1/customer", customer)
app.use("/api/v1/property", property)
app.use("/api/v1/feeder", feeder)
app.use("/api/v1/transformer", transformer)
app.use("/api/v1/account", account)
app.use("/api/v1/meter", meter)
app.use("/api/v1/user", user)


app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        msg: "Welcome my nigga"
    })
});



//PDF Generator
app.post("/api/v1/create-pdf", (req, res, next) => {
        pdf.create(pdfTemplate(req.body), {}).toFile(path.join(`${__dirname}/public/bills/bill.pdf`), (err) => {
            if(err){
                res.send(Promise.reject())
            }
            res.send(Promise.resolve());
        })
})

app.get("/api/v1/fetch-pdf", (req, res, next) => {
    console.log(req.query.name)
    res.sendFile(`${__dirname}/public/bills/${req.query.name}`)
})



//Catch possible Errors
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server starts on port: http://localhost:${PORT}`.yellow.bold))