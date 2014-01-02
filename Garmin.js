var request = require('request').defaults({jar:true});
var querystring = require('querystring');

module.exports = {

  login: function(username, password, callback) {
    
    var which = this;

    request.get('https://connect.garmin.com/signin', function() {

      // Setup actual login request
      var post_data = {
        'login': 'login',
        'login:loginUsernameField': username,
        'login:password': password,
        'login:signInButton': 'Sign In',
        'javax.faces.ViewState': 'j_id1'
      };

      request.post('https://connect.garmin.com/signin', {form:post_data}, function() {
        
        callback();

      });

    });
  },

  loggedIn: function(callback) {

    request.get('https://connect.garmin.com/user/username', function(error, response, body) {
      console.log('Checking for username');
      console.log('body', body);
      
    });

  }


}