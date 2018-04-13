var MongoClient = require('mongodb').MongoClient;

var readyCallbacks = []

var mongo = {
    ready: false,
    onReady: function(func) {
      if (!mongo.ready){
        readyCallbacks.push(func); // add functions to callback when ready 
      } else { // if we are already ready, just call the function
        func(mongo);
      }
    }
}

var connect = function(db){ // Parameters: col: the collection name, cb: a callback, db: overwrite default DB
    var db = db || "create-performance-task";

    var uri = "mongodb+srv://dorian:D0rian800@cluster0-0cfmh.mongodb.net/admin";

    MongoClient.connect(uri, function(err, client) {
        const usersCollection = client.db(db).collection("users");
        const companyCollection = client.db(db).collection("companies");
        const eventsCollection = client.db(db).collection("events");

        mongo.users = usersCollection;
        mongo.companies = companyCollection;
        mongo.events = eventsCollection;

        mongo.client = client;
        
        mongo.ready = true;
        for (let cb in readyCallbacks){
            readyCallbacks[cb](mongo);
        }
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