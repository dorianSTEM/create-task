var modelHelper = require("./modelHelper");

var db;
modelHelper.mongo.onReady = function(){
    db = modelHelper.mongo.users
}

exports.findUser = function(username, password){
    return new Promise(function(resolveParent){
        db.findOne({username:username, password:password}).then(function(doc) {
            if (doc) {
                resolveParent(true);
            } else {
                resolveParent(false);
            }
        });
    });
}