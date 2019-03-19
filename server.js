var mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
var express = require('express');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var fileupload = require('express-fileupload');
var fs = require('fs');
var app = express();
app.use(fileupload({
  limits: {fileSize: 50 * 1024 * 1024},
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const user = require('./user');
const device = require('./device');
const appliances = require('./appliances');

//code for authentication........
var morgan = require('morgan');
app.use(morgan('dev'));
var config = require('./config');
var jwt = require('jsonwebtoken');


app.set('superSecret', config.secret); // secret variable
var apiRoutes = express.Router();

apiRoutes.use(function (req, res, next) {
  var authHeader = req.headers['Authorization'];
  var token = authHeader && authHeader.substr(7);
  if (token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        return res.json({success: false, message: 'Failed to authenticate token.'});
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});


//var port = process.env.PORT || 8080; // used to create, sign, and verify tokens
// mongoose.connect(config.database,{useNewUrlParser: true}); // connect to database

app.get('/', function (req, res) {
  res.json({message: 'Welcome to the coolest API on earth!'});
});

app.post('/login', function (req, res) {
  console.log("1");
  var password = req.body.password;
  var hashed_pass = crypto.createHash('sha512').update(password).digest("hex");
  user.findOne({'user_name': req.body.name}, function (err, user) {
    console.log("2");
    if (err) throw err;
    if (!user) {
      res.json({success: false, message: 'Authentication failed. User not found.'});
    } else if (user) {
      if (user.user_password != hashed_pass) {
        res.json({success: false, message: 'Authentication failed. Wrong password.'});
      } else {
        const payload = {admin: user.admin};
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: "24h"// expires in 24 hours
        });
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

app.post('/register', function (req, res) {
  console.log("i am in register");
  SaveUserData(req);
  var ret = {};
  ret['response'] = "Done";
  res.send(JSON.stringify(ret));
});

apiRoutes.get('/users', function (req, res) {
  user.find({}, function (err, users) {
    res.json(users);
  });
});


/*app.get('/',function(req,res){
    res.send("Hello");
    console.log("host");
});*/

apiRoutes.post('/saveDeviceData', function (req, res) {
  console.log("i am in device");
  SaveDeviceData(req);
  var data1 = {};
  data1['response'] = "Device_Data_Done";
  res.send(JSON.stringify(data1));
});

apiRoutes.post('/saveAppliancesData', function (req, res) {
  console.log("i am in appliances");
  SaveAppliancesData(req);
  var data2 = {};
  data2['response'] = "Appliances_Data_Done";
  res.send(JSON.stringify(data2));
});

apiRoutes.post('/devices_list', function (req, res) {
  console.log("i am in device list");
  var query = device.find();
  query.select('device_name ');
  query.exec(function (err, data) {
    if (err) return handleError(err);
    res.send(JSON.stringify(data));
    console.log(JSON.stringify(data));
  });
});
apiRoutes.get('/devices_data_view', function (req, res) {
  console.log("i am in device data view");
  var query = device.find({'device_name': req.query.deviceName, 'device_location': req.query.location});
  //  var query = device.find({'device_name':req.body.deviceName, 'device_location':location});
  query.select('device_name device_reading device_location reading_time');
  query.exec(function (err, data4) {
    if (err) return handleError(err);
    res.send(JSON.stringify(data4[0]));
    console.log(JSON.stringify(data4[0]));
  });
});

apiRoutes.get('/appliances_list', function (req, res) {
  console.log("i am in appliance list");
  var query = appliances.find();
  query.select('appliance_name ');
  query.exec(function (err, data) {
    if (err) return handleError(err);
    res.send(JSON.stringify(data));
    console.log(JSON.stringify(data));
  });
});
apiRoutes.get('/appliance_data_view', function (req, res) {
  console.log("i am in appliance data view");
  var query = appliances.find({'appliance_name': req.query.applianceName, 'appliance_location': req.query.location});
  //  var query = appliance.find({'appliance_name':req.body.applianceName, 'appliance_location':location});
  query.select('appliance_name appliance_status appliance_location status_time');
  query.exec(function (err, data) {
    if (err) return handleError(err);
    res.send(JSON.stringify(data[0]));
    console.log(JSON.stringify(data[0]));
  });
});

apiRoutes.post('/updateUserAccount', function (req, res) {
  console.log("i am in update account");
  console.log(req.query.id);
  console.log(req.body.name);
  var query = user.findOneAndUpdate({user_id: req.query.id}, {user_name: req.body.name})
  query.exec(function (err, data) {
    if (err) return handleError(err);
    res.send("update done");
  });
});

apiRoutes.post('/upload', function (req, res) {
  console.log(req.files.foo); // the uploaded file object
  fs.writeFileSync('./profile_Image/' + 'kp.jpg', req.files.foo.data)
});

function SaveUserData(req) {
  console.log(req.query.name);
  var password = req.query.password;
  var hashed_pass = crypto.createHash('sha512').update(password).digest("hex");
  var user1 = new user({
    user_name: req.query.name,
    admin: req.query.admin,
    user_id: req.query.id,
    user_img: req.query.id + '.jpg',
    user_email: req.query.email,
    user_mobile: req.query.mobile,
    user_password: hashed_pass
  });
  var str = req.files.foo.name;
  var array = str.split(".");
  fs.writeFileSync('./profile_Image/' + req.query.id + "." + array[1], req.files.foo.data);
  user1.save(function (error) {
    if (error) {
      console.error(error);
    }
  });
}

function SaveDeviceData(req) {
  console.log(req.query.deviceName);
  var device1 = new device({
    device_name: req.query.deviceName,
    device_reading: {
      key: req.query.type,
      value: req.query.value
    },
    device_location: req.query.location,
    reading_time: req.query.time,
  });
  device1.save(function (error) {
    if (error) {
      console.error(error);
    }
  });
}

function SaveAppliancesData(req) {
  console.log(req.query.applianceName);
  var appliance1 = new appliances({
    appliance_name: req.query.applianceName,
    appliance_status: req.query.status,
    appliance_location: req.query.location,
    status_time: req.query.time
  });
  appliance1.save(function (error) {
    if (error) {
      console.error(error);
    }
  });
}

app.use('/api', apiRoutes);

var server = app.listen(4000).on('error', function (err) {
  console.log(err)
});