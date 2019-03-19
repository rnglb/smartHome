var mongoose = require("mongoose");
require('./connection.js');
var Schema = mongoose.Schema;

var deviceSchema = new Schema({
    device_name:String,
    device_reading:[{
        key: String,
        value:String
    }],
    reading_time:String,
    device_location:String
});

const device = mongoose.model("device", deviceSchema);
module.exports=device;