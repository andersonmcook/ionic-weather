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

  weather.history = JSON.parse(localStorage.getItem("searchHistory"));
  console.log("weather.history", weather.history);

// set variables based on call to api
  function weatherData (res) {
    if (res.data.response.hasOwnProperty("error")) {
      weather.errorMessage = res.data.response.error.description;
    } else if (typeof res.data.response.results === "object") {
      weather.errorMessage = "Be more specific";
    } else {
      console.log("results", res);
      weather.errorMessage = "";
      weather.temp = Math.round(res.data.current_observation.temp_f);
      weather.summary = res.data.current_observation.weather;
      weather.icon = res.data.current_observation.icon_url;
      weather.city = res.data.location.city + ",";
      weather.state = res.data.location.state;
      weather.forecasts = res.data.forecast.simpleforecast.forecastday;
      console.log("forecasts", weather.forecasts);
      weather.searchQuery = "";
    }
  };

// search functionality
  weather.search = function () {
    var apikey = "534ef4fb0d0af167";
    var url = "http://api.wunderground.com/api/" + apikey + "/geolookup/conditions/forecast/q/" + weather.searchQuery + ".json";
    // console.log("url", url);
    $http.get(url).then(function (res) {
      weatherData(res);
      return res;
      }).then(function (res) {
// saves searches to history
      var key = res.data.location.city + ", " + res.data.location.state;
      var value = res.data.current_observation.station_id;
      var history = JSON.parse(localStorage.getItem("searchHistory")) || {};
      console.log("history", history);
      if (history.hasOwnProperty(key) === false) {
        history[key] = value;
        localStorage.setItem('searchHistory', JSON.stringify(history));
      }
      // //array version
      // var history = JSON.parse(localStorage.getItem("searchHistory")) || [];
      // if (history.indexOf(res.data.current_observation.station_id) === -1) {
      //   history.push(res.data.current_observation.station_id);
      //   localStorage.setItem('searchHistory', JSON.stringify(history));
      // }
    });
  };

  weather.recall = function (station) {
    var apikey = "534ef4fb0d0af167";
    var url = "http://api.wunderground.com/api/" + apikey + "/geolookup/conditions/forecast/q/pws:" + station + ".json";
    console.log("station", station);
    $http.get(url).then(function (res) {
      weatherData(res);
  });
};

// autoip call then use non-exact latitude and longitude
  $http.get("http://api.wunderground.com/api/534ef4fb0d0af167/geolookup/q/autoip.json").then(function (res) {
    console.log("autoip", res);
    tempLat = res.data.location.lat;
    tempLon = res.data.location.lon;
    var apikey = "534ef4fb0d0af167";
    var url = "http://api.wunderground.com/api/" + apikey + "/geolookup/conditions/forecast/q/" + tempLat + "," + tempLon + ".json";
    $http.get(url).then(function (res) {
        weatherData(res);
      });
  });
});

// .config(function($stateProvider, $urlRouterProvider) {
//   $stateProvider.state('root', {
//     url: '/',
//     template: '<h1>Hello World</h1>'
//   });

//   $urlRouterProvider.otherwise('/');
// })