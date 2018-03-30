var express = require('express');
var router = express.Router();

var userModel = require("./models/userModel");

router.get('/', function(req, res, next){
    console.log("entered main route")
    req.sendFile("client/www/index.html", { root: __dirname });
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

module.exports = router;