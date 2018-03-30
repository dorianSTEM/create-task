var express = require('express');
var router = express.Router();

var userModel = require("./models/userModel");

router.post('/login', function(req, res, next) {
    userModel.findUser(req.body.usr, req.body.pwd).then(function(found){ // PROMISES!!!!!
        if (found){ //check if the user was found
            res.json({loggedIn:true});
        } else {
            res.json({loggedIn:false});
        }
    });
});

router.get('/', function(req, res, next){
    req.sendFile("./client/www/index.html");
});

module.exports = router;