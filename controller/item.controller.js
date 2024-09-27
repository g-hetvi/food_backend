const { StatusCodes } = require('http-status-codes');
const Item=require("../models/items.model")
const HTTP = require("../helper/http");
const { body, validationResult } = require('express-validator');
const path = require("path");
const mongoose=require("mongoose")
const fs = require("fs");

const addAccountType = async (req, res) => {
  try {
    const { title, description,category,price } = req.body;
    const existingAccountType = await Item.findOne({ title: title });
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
    const accountDetails = {
      icon: req.file.filename,
      title: title,
      description: description,
      category:category,
      price:price
    };
    await Item.create(accountDetails);
    res.redirect("/food/list")
    // return res.status(201).json({
    //   status: true,
    //   code: 201,
    //   message: "Account type created successfully.",
    //   data: {},
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

const accountTypeUpdate = async (req, res) => {
  try {
    const { title, description, _id, category, price } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Invalid ID provided.",
      });
    }

    const accountType = await Item.findById(_id);
    if (!accountType) {
      return res.status(404).json({
        status: false,
        code: 404,
        message: "Account type not found.",
      });
    }

    const existingAccountType = await Item.findOne({
      title,
      _id: { $ne: _id }, 
    });

    if (existingAccountType) {
      return res.status(400).json({
        status: false,
        code: 400,
        message: "Account type already exists. Please use a different name.",
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
      if (accountType.icon) {
        const oldFilePath = path.join(__dirname, "images", accountType.icon);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updatedDetails.icon = req.file.filename;
    }

    await Item.findByIdAndUpdate(_id, updatedDetails, { new: true });

    return res.redirect("/food/list");
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

const accountTypeDelete = async (req, res) => {
  try {
    const { food_id } = req.query;

    const categoryWithAccountType = await Item.findOneAndDelete({ _id: food_id });

    if (!categoryWithAccountType) {
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
      data: categoryWithAccountType, 
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
const accountEdit = async (req, res) => {
  const { food_id } = req.query;
  const foods = await Item.findOneAndUpdate(
    { _id: food_id },
    req.body,
    { new: true }
  );
  res.render("foodedit", { foods });
};
const accountTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const searchQuery = {
      status: { $ne: 0 },
      title: { $regex: search, $options: 'i' }
    };
    const food = await Item.find(searchQuery)
                                      .skip(skip)
                                      .limit(limit);
    const totalAccounts = await Item.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalAccounts / limit);
    res.render("food", {
      food: food,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      totalAccounts: totalAccounts,
      search: search
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      code: 400,
      error: "Error fetching accounts",
      data: {}
    });
  }
};
const uiAdd = async (req, res) => {
  res.render('foodadd');
};
const Active=async(req,res)=>{
  try{
        const {id} = req.query;
        const data=await Item.findOneAndUpdate({_id:id}, { isActive: '1' },{new:true});
        res.redirect("/food/list"); 
        
    } catch (error) {
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
         const data= await Item.findByIdAndUpdate({_id:id}, { isActive: '0' },{new:true});
         res.redirect("/food/list");
      } catch (error) {
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          error: "error",
          data: {},
        });
      }
}
module.exports = {
  addAccountType,
  accountTypeUpdate,
  accountTypeDelete,
  homeDeshboard,
  accountTypes,
  accountEdit,
  uiAdd,
  Active,
  Deactive,
  sideBar
};
