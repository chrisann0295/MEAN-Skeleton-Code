angular.module('sampleApp', [
  , 'ngAnimate'
  , 'app.routes'
  , 'userService'
  , 'userCtrl'
  // , 'ui.bootstrap' 
  // other services
  // other controllers

])


// application configuration to integrate token into requests
// .config(function($httpProvider) {
//     // attach our auth interceptor to the http requests
//     $httpProvider.interceptors.push('AuthInterceptor');
// })