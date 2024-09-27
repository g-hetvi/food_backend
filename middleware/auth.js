const jwt = require("jsonwebtoken");
const  User  = require("../models/user.model");
const HTTP = require("../helper/http");
const { mongoose } = require("mongoose");


const hasRole = (user, roles) => {
    if (roles && roles.length) {
        return [].includes(user.role)
            ? true
            : roles.indexOf(user.role) > -1;
    }
    return false;
};

exports.authenticateJWT = function (roles, force = true) {
    return function (req, res, next) {
        const secretOrKey = process.env.JWT_SECRET;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
                if (err) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate your-self', data: {} });

                if (jwtPayload) {
                    const existingUser = await User.findById({ _id: jwtPayload.id });
                    if (existingUser && hasRole(existingUser, roles)) { 
                        req.authenticated = true;
                        req.user = existingUser;

                        next();
                    } else {
                        return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.FORBIDDEN, 'message': 'You don t have sufficient permissions to access this endpoint', data: {} });
                    }
                } else if (!force) {
                    next();
                } else {
                    return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.FORBIDDEN, 'message': 'You dont have sufficient permissions to access this endpoint', data: {} });
                }
            });
        } else if (!force) {
            next();
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate your-self', data: {} });
        }
    };
};


const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 
   try{
    if (!token) {
      return res.redirect('/admin/login'); 
    }
    jwt.verify(token, "token", (err, user) => {
      if (err) {
        return res.redirect('/admin/login');
      }
      req.user = user;
      next();
    });
   }
   catch(err)
  {
    res.clearCookie('token');
    return res.redirect("/admin/signup")
  }
  };
  
module.exports={authenticateToken}