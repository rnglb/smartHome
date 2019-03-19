//only for testing.... to save initial data

var mangoose = require('mongoose');
var user=require("./user");
    // create a sample user
    var nick = new user({ 
      user_name: 'Nick Cerminara', 
      user_password: 'password',
      admin: true 
    });
  nick.save(function(err) {
    console.log("your data has been saved");
    if(error){
        console.error(error);
    }
    });

/*
var a= new user({
    userName:"kashak",
    userDob:16-12-1998,
    userType:"temp",
    userEmail:"s@gmail.com",
    userMobile:9990718551,
    userPassword:"k123"
    
});
a.save(function(error){
    console.log("your data has been saved");
    if(error){
        console.error(error);
    }
});
var b= new user({
    userName:"Nandani",
    userDob:02-01-1998,
 /*   emp_address:{ 
        emp_street:"String",
        emp_city:"String",
        emp_state:"String",
        emp_country:"String",
        emp_pincode:802101
    }, 
    userType:"permanent",
    userEmail:"n@gmail.com",
    userMobile:7590718565,
    userPassword:"n2i3"
    
});
b.save(function(error){
    console.log("your data has been saved");
    if(error){
        console.error(error);
    }
});
*/