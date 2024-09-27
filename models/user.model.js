const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    user_name: {
        type: String,
        default: null
    },
    fullname: {
        type: String,
        default: null
    },
    email: {
        type: String,   
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    icon: {
        type: String,
        default: null
    }, 
    status: {
        type: Number,
        required: true,
        default: 1
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true
    } ,
    is_block: {
        type: Number,
        required: true,
        default: 1
    },
}, { timestamps: true, versionKey: false })

const User = mongoose.model("User", userSchema);

module.exports = User;
