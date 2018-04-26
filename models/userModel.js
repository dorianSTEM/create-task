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

exports.createUser = function(username, password, sessionID){
  return new Promise(function(resolve){
    db.insertOne({username:username, password:password, sessionID:sessionID, verified:false}, function(err, doc) {
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
    db.findOne({sessionID:sessionID}).then(function(doc){
      if (doc){
        resolve({found:true, doc:doc});
      } else {
        resolve({found:false});
      }
    });
  });
}

exports.findJoinedUsers = function(companyID){ //function to check for people who want to join company but have not been approved
  return new Promise(function(resolve){
    db.find({verified:false, companyID:companyID}).toArray(function(err, docs) {
      if (docs.length){
        resolve({found:true, docs:docs});
      } else {
        resolve({found:false});
      }
    });
  });
}

exports.makeAdmin = function(username){
  return new Promise(function(resolve){
    db.update({username:username}, {$set:{admin:true}}).then(function(err) {
      if (!err){
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

exports.joinCompany = function(username, companyID){
  return new Promise(function(resolve){
    db.update({username:username}, {$set:{companyID:companyID}}).then(function(err) {
      if (!err){
        resolve(true);
        console.log("Join company resolved with no errors");
      } else {
        resolve(false);
        console.log("Join company resolved with errors.");
        console.log(err);
      }
    });
  });
}

exports.approveUser = function(username){
  return new Promise(function(resolve){
    db.update({username:username}, {$set:{verified:true, admin:false}}).then(function(err) {
      if (!err){
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}