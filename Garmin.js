var request = require('request').defaults({jar:true});
var querystring = require('querystring');
var $q = require('q');

module.exports = {

  login: function(username, password) {
    
    var deferred = $q.defer();

    request.get('https://connect.garmin.com/signin', function(error, response) {

      if (error) {
        deferred.reject(new Error(error));
      } else if(response.statusCode < 200 || response.statusCode >= 400) {
        deferred.reject(new Error('Request returned status code ' + response.statusCode));
      } else {
        // Setup actual login request
        var post_data = {
          'login': 'login',
          'login:loginUsernameField': username,
          'login:password': password,
          'login:signInButton': 'Sign In',
          'javax.faces.ViewState': 'j_id1'
        };

        request.post('https://connect.garmin.com/signin', {form:post_data}, function(error, response) {
          if (error) {
            deferred.reject(new Error(error));
          } else if(response.statusCode < 200 || response.statusCode >= 400) {
            deferred.reject(new Error('Request returned status code ' + response.statusCode));
          } else {
            deferred.resolve()
          }
        });
      }

    });

    return deferred.promise;
  },

  loggedIn: function() {

    var deferred = $q.defer();

    request.get('https://connect.garmin.com/user/username', function(error, response, body) {
      if (error) {
        deferred.reject(new Error(error));
      } else if(response.statusCode < 200 || response.statusCode >= 400) {
        deferred.reject(new Error('Request returned status code ' + response.statusCode));
      } else {
        var username = JSON.parse(body).username;
        if(username === ''){
          deferred.reject(false);
        } else {
          deferred.resolve(JSON.parse(body).username);
        }
      }
    });

    return deferred.promise;

  },

  /*
   * Supports only .gpx files for now, since that's what Runkeeper exports.
   * Can this help? https://npmjs.org/package/gps-util
   * data {
   *   filename: 'path/to/map.gpx',
   *   activityName:
   *   activityType:
   *   description:
   *   eventType:
   * }
   */
  upload: function(data) {

  }


}