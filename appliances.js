var mongoose = require("mongoose");
require('./connection.js');
var Schema = mongoose.Schema;

var applianceSchema = new Schema({
    appliance_name:String,
    appliance_status:Number, // in the form of 0/1 for off/on...
    status_time:String,
    appliance_location:String
});

const appliances = mongoose.model("appliances", applianceSchema);
module.exports=appliances;