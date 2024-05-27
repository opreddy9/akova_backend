const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const investmentaskschema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    askedby:{
        type:Schema.Types.String,
        ref:'User'
    },
    title: {
        type: String,
        required: true,
        unique: true,
    },
    technologies: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    outcome: {
        type: String,
        required: true,
    },
    attachments: {
        type: String,
        required: true,
    },
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:Number,
        default:0,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
})
module.exports=investmentask=mongoose.model('investmentask',investmentaskschema)