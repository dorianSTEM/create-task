var userModel = require("./models/userModel");
var compModel = require("./models/companyModel");
var eventModel = require("./models/eventModel");

var sockets = {};
var io = function(){};
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
        eventModel.getCompanyEvents(obj.doc.companyID, timestamp).then(function(eventObj) {
          if (obj.found){
            socket.join(obj.doc.companyID);
            socket.emit('new', {docs:eventObj.docs, timestamp:0});
          }
        });
    });
  });
}

exports.setIO = function(io){
  console.log("SETTING IO");
  sockets.io = io;
}

exports.triggerCompany = function(company, timestamp){
  console.log("COMPANY triggered");
  //console.log(JSON.stringify(sockets));
  //console.log("AVAILABLE COMPANIES", sockets[company]);
  eventModel.getCompanyEvents(company, 0).then(function(obj) {
    if (obj.found){
      //sockets[company][sock].socket.emit('new', {docs:obj.docs, timestamp:timestamp});
      sockets.io.sockets.in(company).emit('new', {docs:obj.docs.reverse(), timestamp:timestamp});
    }
  });
}