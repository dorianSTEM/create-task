
var userModel = require("./models/userModel");
var compModel = require("./models/companyModel");
var eventModel = require("./models/eventModel");

var sockets = [];

exports.connection = function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log("disconnect.");
    });

    socket.on("session-id", function(sessionID){
        userModel.getUserBySession(sessionID).then(function(obj){
            console.log(obj.doc);
            if (obj.found){ // if we found the user by his session, send the OK (and user info)
              compModel.findCompanyByObjID(obj.doc.companyID).then(function(compObj){
                if (compObj.found){
                  sockets.push({username:obj.doc.username, company:compObj.doc.name, socket:socket}); // Add this socket to the list of sockets
                }
              });
            } else { // otherwise, send the NOK
              res.json({err:1});
            }
        });
    });
}