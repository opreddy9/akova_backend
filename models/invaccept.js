const mongoose=require('mongoose');
// const { types } = require('tar')
const Schema=mongoose.Schema;
const invaccept=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    investment:{
        type:Schema.Types.ObjectId,
        ref:'investmentask',
    },
    askedby:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    amount:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now(),
    }
});
module.exports=invaccepts=mongoose.model("InvAccept",invaccept)