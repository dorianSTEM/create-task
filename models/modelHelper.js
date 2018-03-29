var MongoClient = require('mongodb').MongoClient;

var mongo = {
    onReady: function() {}
}

var connect = function(db){ // Parameters: col: the collection name, cb: a callback, db: overwrite default DB
    var db = db || "create-performance-task";

    var uri = "mongodb+srv://dorian:D0rian800@cluster0-0cfmh.mongodb.net/admin";

    MongoClient.connect(uri, function(err, client) {
        const collection = client.db(db).collection("users");
        mongo.users = collection;
        mongo.client = client;
        mongo.onReady();
    });
}

process.on('SIGINT', function() {
    mongo.client.close(function(){ // make sure to close our DB connection
        console.log("MONGODB CONNECTION CLOSED");
        process.exit(0);
    });
});

connect();

exports.mongo = mongo;



// https://stackoverflow.com/questions/14495975/why-is-it-recommended-not-to-close-a-mongodb-connection-anywhere-in-node-js-code