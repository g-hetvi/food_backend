const express = require("express");
const router=require("./routes/user.routes")
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser'); 
require("./config/db");

const cors = require("cors"); 

const app = express();  

app.use(cors());
app.use(express.json());
app.set("view engine","ejs")
app.set("views",(__dirname+"/views"))
app.use(express.static(__dirname+"/public"))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true  }));

app.use("/", router);

app.listen(4001, () => {
  console.log("server running on " + `${4001}`);
});
