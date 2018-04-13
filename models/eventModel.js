var modelHelper = require("./modelHelper");

var db;
modelHelper.mongo.onReady(function(mongo){
  db = mongo.events;
});

exports.getCompanyEvents = function(companyID, timeframe){ // timeframe is 
    return new Promise(function(resolve){
        db.findOne({company:companyID, timestamp:{$gt:timeframe}}).then(function(doc) {
          if (doc) {
              console.log(doc);
              resolve({found:true, doc:doc}); // Have to send Object in order to pass 2 Args (Promises allow only on arg)
          } else {
              resolve({found:false});
          }
        });
    });
}

exports.createEvent = function(companyID, title, msg){
    return new Promise(function(resolve){
        db.insertOne({company:companyID, title:title, msg:message, timestamp: new Date().getTime()}, function(err, doc) {
            if (!err) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}