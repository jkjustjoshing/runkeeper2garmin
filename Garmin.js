var request = require('request').defaults({jar:true});
var querystring = require('querystring');
var $q = require('q');
var fs = require('fs');

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
   * data {
   *   filename: 'path/to/map.gpx',
   *   activityName: 'Sample Activity',
   *   activityType: activityTypes['running'][1] or 'street_running'
   *   description: 'Sample Description'
   *   eventType: eventTypes[5] or 'training'
   * }
   *
   * URL for editing activity
   * http://connect.garmin.com/activity/manual?activityId=423280216&mode=edit
   *
   * URL for uploading to
   * http://connect.garmin.com/proxy/upload-service-1.1/json/upload/.gpx
   * 
   */
  upload: function(data) {
    console.log(data);
    
    var deferred = $q.defer();

    // First, request upload page to set the cookies, and 
    // then request manual upload page to set those cookies
    request.get('http://connect.garmin.com/transfer/upload', function(error) {
      if(error) {
        deferred.reject(new Error(error));
      } else {
        request.get('http://connect.garmin.com/api/upload/widget/manualUpload.faces?uploadServiceVersion=1.1', function(error) {
          if(error) {
            deferred.reject(new Error(error));
          } else {
            // Can now upload file
            console.log('Can now upload File');
            var url = 'http://connect.garmin.com/proxy/upload-service-1.1/json/upload/.gpx';
            fs.createReadStream(data.filename).pipe(request.post(url, function(error, response, body) {
              console.log('error', error);
              console.log('response', response);
              console.log('body', body);

            }));

          }
        })
      }
    });










    
  },

  activityTypes: {
    running: [ 'running', 'street_running', 'track_running', 'trail_running', 'treadmill_running' ],
    cycling: [ 'cycling', 'cyclocross', 'downhill_biking', 'indoor_cycling', 'mountain_biking', 'recumbent_cycling', 'road_biking', 'track_cycling', ],
    fitness_equipment: [ 'fitness_equipment', 'elliptical', 'indoor_cardio', 'indoor_rowing', 'stair_climbing', 'strength_training' ],
    hiking: [ 'hiking' ],
    swimming: [ 'swimming', 'lap_swimming', 'open_water_swimming' ],
    walking: [ 'walking', 'casual_walking', 'speed_walking' ],
    transition: [ 'transition', 'swimToBikeTransition', 'bikeToRunTransition', 'runToBikeTransition' ],
    motorcycling: [ 'motorcycling' ],
    other: [ 'other', 'backcountry_skiing_snowboarding', 'boating', 'cross_country_skiing', 'driving_general', 'flying', 'golf', 'horseback_riding', 'inline_skating', 'mountaineering', 'paddling', 'resort_skiing_snowboarding', 'rowing', 'sailing', 'skate_skiing', 'skating', 'snowmobiling', 'snow_shoe', 'stand_up_paddleboarding', 'whitewater_rafting_kayaking', 'wind_kite_surfing' ]
  },
  eventTypes: [
    'geocaching', 'fitness', 'recreation', 'race', 'specialEvent', 'training', 'transportation', 'touring', 'uncategorized'
  ]


};
