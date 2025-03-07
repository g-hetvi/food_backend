const { StatusCodes } = require('http-status-codes');
const collection=require("../models/allproduct.model")
const HTTP = require("../helper/http");
const { body, validationResult } = require('express-validator');
const path = require("path");
const mongoose=require("mongoose")
const fs = require("fs");

const addCollection = async (req, res) => {
  try {
    const { title, description,category,price } = req.body;
    const existingAccountType = await collection.findOne({ title: title });
    if (existingAccountType) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Title already exists Please inculde a difreent Name",
        data: {},
      });
    }
    if (title.length < 3) {
      return res.status(400).send({
        status: false,
        code: 400,
        message: "The title must be at least 3 characters long.",
        data: {},
      });
    } 
    const Details = {
      icon: req.file.filename,
      title: title,
      description: description,
      category:category,
      price:price
    }; 
    const data=await collection.create(Details);

    res.redirect("/collection/list")
    // return res.status(201).json({
    //   status: true,
    //   code: 201,
    //   message: "Account type created successfully.",
    //   data: data,
    // });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({
      status: false,
      code: 500,
      message: "Internal Server Error",
      data: {},
    });
  }
};

const collectionUpdate = async (req, res) => {
  try {
    const { title, description, _id, category, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Invalid ID provided.",
      });
    }

    const collectionType = await collection.findById(_id);
    if (!collectionType) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "This is not found.",
      });
    }

    const existingCollection = await collection.findOne({
      title,
      _id: { $ne: _id }, 
    });

    if (existingCollection) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: " This is already exists. Please use a different name.",
      });
    }

    if (title.length < 3) {
      return res.status(400).send({
        status: false,
        code: 400,
        message: "The name must be at least 3 characters long.",
        data: {},
      });
    }

    let updatedDetails = {
      title,
      category,
      price,
      description,
    };

    if (req.file) {
      if (collectionType.icon) {
        const oldFilePath = path.join(__dirname, "images", collectionType.icon);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updatedDetails.icon = req.file.filename;
    }

    await collection.findByIdAndUpdate(_id, updatedDetails, { new: true });

    return res.redirect("/collection/list");
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      code: 400,
      message: error.message,
      data: {},
    });
  }
};

const collectionDelete = async (req, res) => {
  try {
    const { delete_id } = req.query;

    const detalis = await collection.findOneAndDelete({ _id: delete_id });

    if (!detalis) {
      return res.status(404).send({
        status: false,
        code: 404,
        message: "Item not found",
        data: {},
      });
    }

    return res.status(200).send({
      status: true,
      code: 200,
      message: "Deleted Successfully",
      data: detalis, 
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      status: false,
      code: 400,
      message: "Error",
      data: {},
    });
  }
};

const sideBar=(req,res)=>{
  res.render("sidebar")
};
const homeDeshboard = async (req, res) => {
  res.render("deshboard");
};
const collectionEdit = async (req, res) => {
  const { collection_id } = req.query;
  const product = await collection.findOneAndUpdate(
    { _id: collection_id },
    req.body,
    { new: true }
  );
  res.render("productedit", { product });
};
const collections = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const searchQuery = {
      status: { $ne: 0 },
      title: { $regex: search, $options: 'i' }
    };
    const collectionlist = await collection.find(searchQuery)
                                      .skip(skip)
                                      .limit(limit);
    const total = await collection.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limit);
    res.render("collections", {
      collectionlist: collectionlist,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      total: total,
      search: search
    });
  } catch (error) {  
    return res.status(400).send({
      status: false,
      code: 400,
      error: "Error fetching",
      data: {}
    });
  }
};
const uiAdd = async (req, res) => {
  res.render('collectionadd');
};
const Active=async(req,res)=>{
  try{
        const {id} = req.query;
        const data=await collection.findOneAndUpdate({_id:id}, { isActive: '1' },{new:true});
        res.redirect("/collection/list"); 
        
    } catch (error) {
      console.log(error);
      
      return res.status(HTTP.BAD_REQUEST).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        error: "error",
        data: {},
      });
    }
  }
const Deactive=async(req,res)=>{
    try{
           const {id} = req.query;
         const data= await collection.findByIdAndUpdate({_id:id}, { isActive: '0' },{new:true});
         res.redirect("/collection/list");
      } catch (error) {
        console.log(error);
        
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          error: "error",
          data: {},
        });
      }
}
module.exports = {
  addCollection,
  collectionUpdate,
  collectionDelete,
  homeDeshboard,
  collections,
  collectionEdit,
  uiAdd,
  Active,
  Deactive,
  sideBar
};
