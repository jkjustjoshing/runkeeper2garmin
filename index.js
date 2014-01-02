var runkeeper = require('./Runkeeper');
var garmin = require('./Garmin');

garmin.login('username', 'password').then(function() {
  return garmin.loggedIn();
}).then(function(){
  console.log('logged in!');
}, function(){
  console.log('not logged in');
});