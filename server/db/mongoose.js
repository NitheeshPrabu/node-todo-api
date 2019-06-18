const mongoose = require('mongoose');

// Earlier versions of mongoose needed a Promise library to be set
// Not required since Mongoose 5
// mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });

module.exports = { mongoose };