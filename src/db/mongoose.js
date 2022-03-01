const mongoose = require('mongoose');
//connect db on port 27017 of mongodb and collection task manager
// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')

mongoose.connect(process.env.Mongo_URL)
