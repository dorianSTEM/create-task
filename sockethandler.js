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
        }).then(function(){
          userModel.findJoinedUsers(obj.doc.companyID).then(function(obj){
            if (obj.found){
              console.log("---------FOUND USERS THAT WANT TO JOIN THE COMPANY--------");
              socket.emit('joiner', {docs:obj.docs});
            }
          });
        });
    })
  });

  socket.on("accept", function(obj){
    userModel.approveUser(obj.username);
  });
}

exports.setIO = function(io){
  console.log("SETTING IO");
  sockets.io = io;
}

exports.triggerCompany = function(company, timestamp){
  console.log("COMPANY triggered");
  timestamp = 0;
  //console.log(JSON.stringify(sockets));
  //console.log("AVAILABLE COMPANIES", sockets[company]);
  eventModel.getCompanyEvents(company).then(function(obj) {
    if (obj.found){
      //sockets[company][sock].socket.emit('new', {docs:obj.docs, timestamp:timestamp});
      sockets.io.sockets.in(company).emit('new', {docs:obj.docs.reverse(), timestamp:timestamp});
    }
  });
}

exports.triggerJoinedUsers = function(company){
  console.log("~~~~TRIGGERED!!~~~~~")
  userModel.findJoinedUsers(company).then(function(obj){
    if (obj.found){
      console.log("---------FOUND USERS THAT WANT TO JOIN THE COMPANY--------");
      sockets.io.sockets.in(company).emit('joiner', {docs:obj.docs});
    }
  });
}