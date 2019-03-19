const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/SecureHomeData2345',{useNewUrlParser: true});

mongoose.connection.once('open',function(){
      console.log('connection has made');
});