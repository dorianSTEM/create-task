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

    socket.on("session-id", function(obj){ // set session ID and also send new event data
        console.log("Session ID acquired");
        var sessionID = obj.sessionID;
        var timestamp = obj.timestamp || 0;

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
                
                console.log("WE HAVE A TIMESTAMP", timestamp);

                eventModel.getCompanyEvents(obj.doc.companyID, timestamp).then(function(eventObj) {
                  if (obj.found){
                    for (var sock in sockets[obj.doc.companyID]){
                      sockets[obj.doc.companyID][sock].socket.emit('new', {docs:eventObj.docs, timestamp:timestamp});
                    }
                  }
                });

              });
            }
        });
    });
}

exports.triggerCompany = function(company, timestamp){
  console.log("COMPANY triggered");
  //console.log(JSON.stringify(sockets));
  console.log("AVAILABLE COMPANIES", sockets[company]);
  if (obj.found){
    for (var sock in sockets[company]){
      eventModel.getCompanyEvents(company, sockets[company][sock].lastCheck).then(function(obj) {
        sockets[company][sock].socket.emit('new', {docs:obj.docs, timestamp:timestamp});
      });
    }
  }
}