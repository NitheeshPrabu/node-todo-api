const mongoose = require('mongoose');

// Earlier versions of mongoose needed a Promise library to be set
// Not required since Mongoose 5
// mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp', { useNewUrlParser: true });

module.exports = { mongoose };