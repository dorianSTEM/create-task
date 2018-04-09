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
              resolve({found:true, doc:doc}); // Have to send Object for 2 Args
          } else {
              resolve({found:false});
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