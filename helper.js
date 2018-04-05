// This file contains a bunch of abstractions to keep the main code short

exports.makeid = function makeid(length) { // Credit goes to csharptest.net from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return text;
}