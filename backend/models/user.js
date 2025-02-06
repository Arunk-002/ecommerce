const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    address: [{
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    }]
    
    
},{timestamps:true})

const User = mongoose.model('User',userSchema)

module.exports=User