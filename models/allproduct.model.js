const mongoose = require("mongoose");

const allProductSchema = new mongoose.Schema({
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
price: {
    type: Number,
    required: true,
},
category: {
  type: String,
  required: true,
},

isActive: {
  type: Number,
  required: true,
  default: 1,
},
  status: {
    type: Number,
    required: true,
    default: 1,
  },
});

const allproduct = mongoose.model("allproduct", allProductSchema);
module.exports = allproduct;
