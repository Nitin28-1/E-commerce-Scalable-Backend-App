const mongoose = require("mongoose");

const MockAuth = (req, res, next) => {
  req.user = {
    _id: new mongoose.Types.ObjectId(),
    role: "Seller"
  };
  next();
};


module.exports=MockAuth;