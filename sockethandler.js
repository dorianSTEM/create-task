
var userModel = require("./models/userModel");
var compModel = require("./models/companyModel");
var eventModel = require("./models/eventModel");

var sockets = {};
//var socketCompanies = {};

exports.connection = function(socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log("disconnect.");
    });

    socket.on("session-id", function(sessionID){
        console.log("Session ID acquired");
        userModel.getUserBySession(sessionID).then(function(obj){
            console.log(obj.doc);
            if (obj.found){ // if we found the user by his session, send the OK (and user info)
              compModel.findCompanyByObjID(obj.doc.companyID).then(function(compObj){
                if (compObj.found){
                  if (!sockets[obj.doc.companyID]){
                    console.log("ADDING TO LIST");
                    sockets[obj.doc.companyID] = [{username:obj.doc.username, socket:socket, lastCheck:0}]; // Add this socket to the list of sockets
                  } else {
                    console.log("ADDING TO ARR");
                    sockets[obj.doc.companyID].push({username:obj.doc.username, socket:socket, lastCheck:0})
                  }
                }
              });
            }
        });
    });
}

exports.triggerCompany = function(company){
  console.log("COMPANY triggered");
  console.log(JSON.stringify(sockets));
  console.log("AVAILABLE COMPANIES", sockets[company]);
  for (var sock in sockets[company]){
    eventModel.getCompanyEvents(company, sockets[company][sock].lastCheck).then(function(obj) {
      if (obj.found){
        sockets[company][sock].socket.emit('new', obj.docs);
      }
    });
  }
}