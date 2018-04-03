var modelHelper = require("./modelHelper");

var db;
modelHelper.mongo.onReady(function(mongo){
  db = mongo.companies;
});

exports.findCompanyByName = function(name){
  return new Promise(function(resolve){
        db.findOne({name:name}).then(function(doc) {
          if (doc) {
              console.log(doc);
              resolve(true, doc);
          } else {
              resolve(false);
          }
        });
    });
}

exports.createCompany = function(name){
  return new Promise(function(resolve){
    db.insertOne({name:name}, function(err, doc) {
        if (!err) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
  });
}