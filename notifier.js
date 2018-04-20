var events = [];

exports.onNewEvent = function(companyObjID, cb){ // called to raise a new event listener when a company event  is added
    events.push({companyId:companyObjID, cb:cb});
}

exports.triggerEvent = function(companyId, data){ // called when a new event is added for a specific company (eg. conference)
    for (var evt in events){
        if (evt.companyId == companyId){
            evt.cb(data);
        }
    }
}
