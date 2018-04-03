var modelHelper = require("./modelHelper");

var db;
modelHelper.mongo.onReady(function(mongo){
  db = mongo.users;
});

exports.findUser = function(username, password){ // Find User by username and password (for authentication)
    return new Promise(function(resolve){
        db.findOne({username:username, password:password}).then(function(doc) {
          if (doc) {
              console.log(doc);
              resolve(true, doc);
          } else {
              resolve(false);
          }
        });
    });
}

exports.findUserByUsername = function(username){ // Find User by username (to make sure user is unique)
  return new Promise(function(resolve){
    db.findOne({username:username}).then(function(doc) {
        if (doc) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
  });
}

exports.createUser = function(username, password, company){
  return new Promise(function(resolve){
    db.insertOne({username:username, password:password, verified:false, companyID:company}, function(err, doc) {
        if (!err) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
  });
};

exports.getCompanyEvents = function(companyId){
  
}