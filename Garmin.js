var https = require('https');
var querystring = require('querystring');

module.exports = {

  cookies: {},

  cookieString: function(){
    var cookieArr = [];

    for (var key in this.cookies) {
      cookieArr[cookieArr.length] = key + "=" + this.cookies[key];
    }

    return cookieArr.join("&");

  },

  login: function(username, password, callback) {
    
    var which = this;

    https.get('https://connect.garmin.com/signin', function(res) {

      // Save the cookies that were just sent
      console.log('First Cookies', res.headers['set-cookie']);
      res.headers['set-cookie'].forEach(function(cookie) {
        var cookiePair = (cookie.split('; ')[0]).split('=');
        which.cookies[cookiePair[0]] = cookiePair[1];
      });

      // Setup actual login request
      var post_data = querystring.stringify({
        'login': 'login',
        'login:loginUsernameField': username,
        'login:password': password,
        'login:signInButton': 'Sign In',
        'javax.faces.ViewState': 'j_id1'
      });

      var options = {
        hostname: 'connect.garmin.com',
        path: '/signin',
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length,
          'Cookie': which.cookieString()
        }
      };

      var req = https.request(options, function(res) {
        console.log('Second Cookies', res.headers['set-cookie']);

        res.headers['set-cookie'].forEach(function(cookie) {
          var cookiePair = (cookie.split('; ')[0]).split('=');
          which.cookies[cookiePair[0]] = cookiePair[1];
        });


        callback();

      });
      req.end();


    });
  },

  loggedIn: function(callback) {
    var which = this;

    console.log('loginCookies!!', which.cookies);


    var options = {
      hostname: 'connect.garmin.com',
      path: '/user/username',
      method: 'GET',
      headers: {
        'Cookie': which.cookieString()
      }
    };

    https.request(options, function(res) {
      console.log('Checking for username');

      res.on("data", function(chunk) {
        console.log("BODY: ", JSON.parse(chunk));
      });
    }).end();

  }


}