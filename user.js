var mongoose = require("mongoose");
require('./connection.js');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  user_name:String,
  admin:Boolean,
  user_img:String,
  user_id:String,
  user_email:String,
  user_mobile:Number,    
  user_password:String,
});

const user = mongoose.model("user", userSchema);
module.exports=user;