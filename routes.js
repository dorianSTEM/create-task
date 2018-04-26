// By: Dorian Cauwe
// AP COMPUTER SCIENCE PRINCIPLES CREATE PERFORMANCE TASK
// April, 2018
// server URL: create-performance.herokuapp.com

var express = require('express');
var router = express.Router();

var userModel = require("./models/userModel");
var compModel = require("./models/companyModel");

var eventModel = require("./models/eventModel");

var helper = require("./helper");

router.use(express.static(__dirname + "/client/www"));

// -------------------- Error Codes --------------------
// - Passed with JSON err key/value
// 0: No Error, the request was completed successfully
// 1: User Error, this can be Authentication or Sign Up Error
// 2: Company Error, this can be company Authentication or Duplicate Company Error

router.get('/', function(req, res, next){ // send Ionic Web App on / route
  console.log("entered main route");
  console.log(__dirname + "/client/www/index.html");
  res.sendFile(__dirname + "/client/www/index.html");
});

router.post('/login', function(req, res, next) {
  userModel.findUser(req.body.usr, req.body.pwd).then(function(obj){ // PROMISES!!!!!
    if (obj.found && obj.doc.companyID){ //check if the user was found
      res.json({loggedIn:true, session:obj.doc.sessionID, company:true, verified:obj.doc.verified});
    } else if (obj.found) {
      res.json({loggedIn:true, session:obj.doc.sessionID, company:false, verified:false});
    } else {
      res.json({loggedIn:false});
    }
  });
});

router.post('/signup', function(req, res, next) {
  console.log("ENTER SIGNUP");
  userModel.findUserByUsername(req.body.usr).then(function(found){
    if (found) { // check if we found the username
      res.json({err:1, type:"Username Already In Use!"});
    } else if (req.body.pwd.length < 8) { // check if the password is not long enough
      res.json({err:1, type:"Password is shorter than 8 characters!"});
    } else { // otherwise the username is good/unique and the password is long enough
      var sessionID = helper.makeid(16);
      userModel.createUser(req.body.usr, req.body.pwd, sessionID).then(function(success){ // create user using username, password, and the company _id
        if (success){ // success, the user was created!!
          res.json({err:0, company:false, session:sessionID});
        } else {
          res.json({err:1, type:"Unknown Error, Try Again Later..."});
        }
      }); 
      
      // compModel.companyAuth(req.body.cmp, req.body.pass).then(function(obj){ // try to find the company the user said he was part of
      //   if (obj.found){ // if the company was found, we're good
      //     var sessionID = helper.makeid(16);
      //     //var sessionExpiration = new Date.now() + 24*60*60*1000; // set the session expiration to 1 day from now (24 hours)
      //                                           // HH,MM,SS,MS
          
      //     // Session expiration has been removed (maybe if I have more time...)
      //     console.log("COMPANY DOC: ", obj.doc);
          
      //     userModel.createUser(req.body.usr, req.body.pwd, obj.doc._id, sessionID).then(function(success){ // create user using username, password, and the company _id
      //       if (success){ // success, the user was created!!
      //         res.json({err:0, session:sessionID});
      //       } else {
      //         res.json({err:1, type:"Unknown Error, Try Again Later..."});
      //       }
      //     }); 
      //   } else { // If the company does not exist, the user cannot join it
      //     res.json({err:2, type:"Invalid Company Details!"});
      //   }
      // });
    }
  });
});

router.post('/createCompany', function(req, res, next){
  compModel.findCompanyByName(req.body.name).then(function(obj){
    if (!obj.found){
      compModel.createCompany(req.body.name, req.body.descr).then(function(obj){
        if (obj.success){
          userModel.getUserBySession(req.session).then(function(usrObj){
            if (obj.found){
              userModel.joinCompany(usrObj.doc.username, obj.doc._id).then(function(){
                userModel.approveUser(usrObj.doc.username).then(function(){
                  res.json({err:0});
                });
              });
            } else {
              res.json({err:1});
            }
            
          });
        } else {
          res.json({err:1, type:"Unknown Error, Try Again Later..."});
        }
      });
    } else {
      res.json({err:1, type:"Company Name Already Exists..."});
    }
  });
});

router.post('/joinCompany', function(req, res, next){
  userModel.getUserBySession(req.body.session).then(function(obj){
    console.log("Entered Company join.")
    console.log("REQ BODY", req.body);
    console.log("USER OBJ", obj);
    compModel.findCompanyByName(req.body.name).then(function(compObj){
      if (obj.found && compObj.found){
        console.log("<<<<<<<< ALL FOUND >>>>>>>>");
        console.log(obj.doc.username);
        console.log(compObj.doc.name);
        userModel.joinCompany(obj.doc.username, compObj.doc._id);
        res.json({err:0});
      } else {
        res.json({err:1, type:"Company Not Found"});
      }
    });
  });
});

router.post('/approveUser', function(req, res, next){
  userModel.getUserBySession(req.body.session).then(function(obj){
    userModel.findUserByUsername(req.body.username).then(function(guestObj){
      if (obj.found && guestObj.found && obj.doc.admin && obj.doc.companyID == guestObj.companyID){
        userModel.approveUser(req.body.username);
        res.json({err:0});
      } else {
        res.json({err:1, type:"Not Allowed"});
      }
    });
    
    if (obj.found){ // if we found the user by his session, send the OK (and user info)      
      eventModel.createEvent(obj.doc.companyID);
    }
  });
});

router.post('/authenticate', function(req, res, next){ // authenticate with user ID, send user and company details back
  userModel.getUserBySession(req.body.session).then(function(obj){
    console.log(obj.doc);
    if (obj.found){ // if we found the user by his session, send the OK (and user info)

      compModel.findCompanyByObjID(obj.doc.companyID).then(function(compObj){
        if (compObj.found){
          res.json({err:0, username:obj.doc.username, company:compObj.doc.name, obj:obj});
        } else {
          res.json({err:1}); 
        }
      });
    } else { // otherwise, send the NOK
      res.json({err:1});
    }
  });
});

router.post("/createEvent", function(req, res, next){
  userModel.getUserBySession(req.body.session).then(function(obj){
    console.log(obj.doc);
    if (obj.found){ // if we found the user by his session, send the OK (and user info)      
      eventModel.createEvent(obj.doc.companyID, req.body.title, req.body.msg, req.body.author, req.body.date);
      res.json({err:0});
    } else { // otherwise, send the NOK
      res.json({err:1});
    }
  });
});

// router.post('/updates', function(req, res, next){ // check for new announcements.
//   var lastTimeStamp = req.body.timeStamp; // This timestamp is sent to represent when data was retrieved for the last time
  
//   userModel.getUserBySession(req.body.session).then(function(obj){ // First, find the User by his session (In order to find company ID)
//     if (obj.found){
//       var companyObjID = obj.doc.companyID;
//       //res.json({err:0});

//       compModel.findCompanyByObjID(companyObjID).then(function(obj){
//         if (obj.found){
//           if (obj.doc.timestamp > lastTimeStamp){ // Check if the latest company updates were done before the client app last refreshed info
            
//             res.json({err:0, newInfo:true, companyDoc:obj.doc});
//           } else {
//             res.json({err:0, newInfo:false});
//           }

//         } else {
//           res.json({err:2, type:"Your Company Does Not Exist..."});
//         }
//       });

//     } else {
//       res.json({err:1, type:"Authenticaton Error, Please Log In Again..."});
//     }
//   });
// });

module.exports = router;