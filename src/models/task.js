var mongoose = require('mongoose');
const task = mongoose.model('Task',{
    title:{
        required:true,
        trim:true,
        type:String
    },
    description:{
        required:true,
        trim:true,
        type:String
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'

    }
})
module.exports = task;