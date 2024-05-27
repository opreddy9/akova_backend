const mongoose=require('mongoose')
const { types } = require('tar')
const Schema=mongoose.Schema
const ideaschema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    problem:{
        type:Schema.Types.ObjectId,
        ref:"postproblem"
    },
    description:{
        type:String,
        required:true,
    },
    attachments:{
        type:String,
    },
    status:{
        type:String,
        default:"pending"
    },
    date:{
        type:Date,
        default:Date.now()
    }
})
module.exports=Idea=mongoose.model('idea',ideaschema)
