var sampleApp = angular.module('app.routes', ['ngRoute'])

sampleApp.config(function($routeProvider, $locationProvider){
  $routeProvider

  // Route for home page
  .when("/", {
    templateUrl: 'app/views/pages/user.html',
    controller: 'userController',
    controllerAs: 'user'
  })

  // .when('/login', {
  //     templateUrl: 'app/views/pages/login.html',
  //     controller: 'loginController',
  //     controllerAs: 'login'
  //   })

  // .when('/register', {
  //   templateUrl: 'app/views/pages/register.html',
  //   controller: 'registerController',
  //   controllerAs: 'register'
  // })

  // sampleApp.run(function ($rootScope, $location, $route, AuthService) {
  //   $rootScope.$on('$routeChangeStart', function (event, next, current) {
  //     if (AuthService.isLoggedIn() === false) {
  //       $location.path('/login');
  //       $route.reload();
  //     } else {
  //     }
  //   });
  // });

  $locationProvider.html5Mode(true);

});
