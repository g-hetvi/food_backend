const mongoose = require('mongoose')
const Schema = mongoose.Schema

const itemSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: Number,
        required: true,
        default: 1,
      },
      isActive: {
        type: Number,
        required: true,
        default: 1,
      },
}, { timestamps: true, versionKey: false })

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
