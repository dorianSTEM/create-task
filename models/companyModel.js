var modelHelper = require("./modelHelper")

var db;
modelHelper.mongo.onReady(function(mongo){
  db = mongo.companies;
});

exports.findCompanyByName = function(name){
  return new Promise(function(resolve){
        db.findOne({name:name}).then(function(doc) {
          if (doc) {
              console.log(doc);
              resolve({found:true, doc:doc}); // Have to send Object in order to pass 2 Args (Promises allow only on arg)
          } else {
              resolve({found:false});
          }
        });
    });
}

exports.companyAuth = function(name, passphrase){
    return new Promise(function(resolve){
        db.findOne({name:name, passphrase:passphrase}).then(function(doc) {
          if (doc) {
              console.log(doc);
              resolve({found:true, doc:doc}); // Have to send Object for 2 Args
          } else {
              resolve({found:false});
          }
        });
    });
}

exports.createCompany = function(name, description){
  return new Promise(function(resolve){
    db.insertOne({name:name, description:description, timestamp:new Date().getTime()}, function(err, doc) { // timestamp describes when company data was last updated
        if (!err) {
            resolve({success:true, doc:doc});
        } else {
            resolve({success:false});
        }
    });
  });
}

exports.findCompanyByObjID = function(companyID){
    return new Promise(function(resolve){
        db.findOne({_id:companyID}).then(function(doc) {
            if (doc) {
                console.log(doc);
                resolve({found:true, doc:doc}); // Have to send Object for 2 Args
            } else {
                resolve({found:false});
            }
          });
      });
}

exports.touch = function(companyID) { // "touch" company info (change timestamp)
    return new Promise(function(resolve){
        db.updateOne({_id:companyID}, {$set:{timestamp:new Date().getTime()}}, function(err, res) {
            if (err) {
                resolve({success:false});
            } else {
                resolve({success:true});
            }
          });
      });
}