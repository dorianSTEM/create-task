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
              resolve({found:true, doc:doc});
          } else {
              resolve({found:false});
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

exports.createUser = function(username, password, company, sessionID){
  return new Promise(function(resolve){
    db.insertOne({username:username, password:password, verified:false, companyID:company, sessionID:sessionID}, function(err, doc) {
        if (!err) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
  });
};

exports.getUserBySession = function(sessionID){
  return new Promise(function(resolve){
    db.findOne({sessionID:sessionID}).then(function(doc) {
      if (doc){
        resolve(true, doc);
      } else {
        resolve(false);
      }
    });
  });
}

exports.approveUser = function(username){
  return new Promise(function(resolve){
    db.update({username:username}, {$set:{verified:true}}).then(function(err) {
      if (!err){
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}