const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.mongoURI, {
            useCreateIndex : true,
            useFindAndModify: false,
            useNewUrlParser : true,
            useUnifiedTopology : true
        })

        console.log(`Connection to ${conn.connection.host} DB secured!`.cyan.underline.bold)
    } catch (err) {
        console.error(err.messega);
        process.exit(1)
    }
}

module.exports = connectDB;