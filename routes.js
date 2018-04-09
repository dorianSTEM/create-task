var express = require('express');
var router = express.Router();

var userModel = require("./models/userModel");
var compModel = require("./models/companyModel");

var helper = require("./helper");

router.use(express.static(__dirname + "/client/www"));

router.get('/', function(req, res, next){ // send Ionic Web App on / route
    console.log("entered main route");
    console.log(__dirname + "/client/www/index.html");
    res.sendFile(__dirname + "/client/www/index.html");
});

router.post('/login', function(req, res, next) {
    userModel.findUser(req.body.usr, req.body.pwd).then(function(found, doc){ // PROMISES!!!!!
        if (found){ //check if the user was found
            res.json({loggedIn:true, session:doc.sessionID});
        } else {
            res.json({loggedIn:false});
        }
    });
});

router.post('/signup', function(req, res, next) {
  userModel.findUserByUsername(req.body.usr).then(function(found){
    if (found) { // check if we found the username
      res.json({err:1, type:"Username Already In Use!"});
    } else if (req.body.pwd.length < 8) { // check if the password is not long enough
      res.json({err:1, type:"Password is shorter than 8 characters!"});
    } else { // otherwise the username is good/unique and the password is long enough
      
      compModel.findCompanyByName(req.body.cmp).then(function(found, doc){ // try to find the company the user said he was part of
        if (found){ // if the company was found, we're good
          var sessionID = helper.makeid(16);
          //var sessionExpiration = new Date.now() + 24*60*60*1000; // set the session expiration to 1 day from now (24 hours)
                                                // HH,MM,SS,MS
          
          // Session expiration has been removed (maybe if I have more time...)
          
          userModel.createUser(req.body.usr, req.body.pwd, doc._id, sessionID).then(function(success){ // create user using username, password, and the company _id
            if (success){ // success, the user was created!!
              res.json({err:0, session:sessionID});
            } else {
              res.json({err:1, type:"Unknown Error, Try Again Later..."});
            }
          }); 
        } else { // If the company does not exist, the user cannot join it
          res.json({err:1, type:"Company Does Not Exist!"});
        }
      });
    }
  });
});

router.post('/createCompany', function(req, res, next){
  compModel.findCompanyByName(req.body.name).then(function(found){
    if (!found){
      compModel.createCompany(req.body.name).then(function(success){
        if (success){
          req.json({err:0});
        } else {
          req.json({err:1, type:"Unknown Error, Try Again Later..."});
        }
      });
    } else {
      req.json({err:1, type:"Company Name Already Exists..."});
    }
  });
});

router.post('/authenticate', function(req, res, next){ // authenticate with user ID
  userModel.getUserBySession(req.body.session).then(function(found, doc){
    if (found){ // if we found the user by his session, send the OK
      req.json({err:0});
    } else { // otherwise, send the NOK
      req.json({err:1})
    }
  });
});

module.exports = router;