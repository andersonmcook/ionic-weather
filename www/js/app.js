// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('weatherCtrl', function ($http) {
    var weather = this;
    weather.temp = "--";
    weather.summary = "Loading ...";

    var tempLat, tempLon;

    $http.get("http://api.wunderground.com/api/534ef4fb0d0af167/geolookup/q/autoip.json").then(function (res) {
      console.log("autoip", res);
      tempLat = res.data.location.lat;
      tempLon = res.data.location.lon;
      var apikey = "534ef4fb0d0af167";
      var url = "http://api.wunderground.com/api/" + apikey + "/geolookup/conditions/forecast/q/" + tempLat + "," + tempLon + ".json";
      $http.get(url).then(function (res) {
          console.log("weather", res);
          weather.temp = Math.round(res.data.current_observation.temp_f);
          weather.summary = res.data.current_observation.weather;
          weather.icon = res.data.current_observation.icon_url;
          weather.city = res.data.location.city + ",";
          weather.state = res.data.location.state;
          weather.forecasts = res.data.forecast.simpleforecast.forecastday;
          console.log(weather.forecasts);
        });
    });

    // weather.reload = function () {
    //   navigator.geolocation.getCurrentPosition(function (geopos) {
    //     var lat = geopos.coords.latitude;
    //     var long = geopos.coords.longitude;
    //     var apikey = "534ef4fb0d0af167";
    //     var url = "http://api.wunderground.com/api/" + apikey + "/geolookup/conditions/forecast/q/" + lat + "," + long + ".json";
    //     $http.get(url).then(function (res) {
    //       console.log(res);
    //       weather.temp = Math.round(res.data.current_observation.temp_f);
    //       weather.summary = res.data.current_observation.weather;
    //       weather.icon = res.data.current_observation.icon_url;
    //       weather.city = res.data.location.city + ",";
    //       weather.state = res.data.location.state;
    //       weather.forecasts = res.data.forecast.simpleforecast.forecastday;
    //       console.log(weather.forecast);
    //     });
    //   });
    // }

    // weather.reload();


});

// .config(function($stateProvider, $urlRouterProvider) {
//   $stateProvider.state('root', {
//     url: '/',
//     template: '<h1>Hello World</h1>'
//   });

//   $urlRouterProvider.otherwise('/');
// })