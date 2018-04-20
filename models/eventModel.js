var modelHelper = require("./modelHelper");
var socketHandler = require("../sockethandler");

var db;
modelHelper.mongo.onReady(function(mongo){
  db = mongo.events;
});

exports.getCompanyEvents = function(companyID, timeframe){ // timeframe is the date (UNIX time) when the user last updated his Even Info
    return new Promise(function(resolve){
        db.find({company:companyID, timestamp:{$gt:timeframe}}).toArray(function(err, docs) {
          if (docs) {
              console.log(docs);
              resolve({found:true, docs:docs}); // Have to send Object in order to pass 2 Args (Promises allow only on arg)
          } else {
              resolve({found:false});
          }
        });
    });
}

exports.createEvent = function(companyID, title, msg){
    return new Promise(function(resolve){
        var timestamp = new Date().getTime();
        db.insertOne({company:companyID, title:title, msg:msg, timestamp: timestamp}, function(err, doc) {
            if (!err) {
                socketHandler.triggerCompany(companyID, timestamp);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}