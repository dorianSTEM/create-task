var express = require('express');
var router = express.Router();

var userModel = require("./models/userModel");
var compModel = require("./models/companyModel");

router.use(express.static(__dirname + "/client/www"));

router.get('/', function(req, res, next){ // send Ionic Web App on / route
    console.log("entered main route");
    console.log(__dirname + "/client/www/index.html");
    res.sendFile(__dirname + "/client/www/index.html");
});

router.post('/login', function(req, res, next) {
    userModel.findUser(req.body.usr, req.body.pwd).then(function(found){ // PROMISES!!!!!
        if (found){ //check if the user was found
            res.json({loggedIn:true});
        } else {
            res.json({loggedIn:false});
        }
    });
});

router.post('/signup', function(req, res, next) {
  userModel.findUserByUsername(req.body.usr).then(function(found){
    if (found) {
      res.json({err:1, type:"Username Already In Use!"});
    } else {
      userModel.createUser(req.body.usr, req.body.pwd).then(function(success){
        if (success){
          res.json({err:0});
        } else {
          res.json({err:1, type:"Unknown Error, Try Again Later..."})
        }
      });
    }
  });
});

module.exports = router;