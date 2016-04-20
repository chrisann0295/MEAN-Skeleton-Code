var myApp = angular.module('app.routes', ['ngRoute'])

myApp.config(function($routeProvider, $locationProvider){

  $routeProvider

  // Route for home page
  .when("/", {
    templateUrl: 'app/views/pages/home.html',
    controller: '',
    controllerAs: ''
  })

  
  // // Route for home page
  // .when("/", {
  //   templateUrl: 'app/views/pages/dayselector.html',
  //   controller: 'daySelectorController',
  //   controllerAs: 'selector'
  // })

  // .when("/profile", {
  //   templateUrl: 'app/views/pages/profile.html',
  //   controller: 'profileController',
  //   controllerAs: 'profile'
  // })

  // // Route for home page
  // .when("/schedule", {
  //   templateUrl: 'app/views/pages/schedule.html',
  //   controller: 'scheduleController',
  //   controllerAs: 'schedule'
  // })

  // // Route for home page
  // .when("/users", {
  //   templateUrl: 'app/views/pages/users/all.html',
  //   controller: 'userController',
  //   controllerAs: 'user'
  // })

  // // Route for user create page
  // .when("/users/create", {
  //   templateUrl: 'app/views/pages/users/single.html',
  //   controller: 'userCreateController',
  //   controllerAs: 'user'
  // })

  //   // page to edit a user
  //   .when("/users/:user_id", {
  //       templateUrl: 'app/views/pages/users/single.html',
  //       controller: 'userEditController',
  //       controllerAs: 'user'
  //   })

  // //Page for login screen
  //   .when("/login", {
  //   templateUrl: 'app/views/pages/login.html',
  //   controller: 'loginController',
  //   controllerAs: 'login'
  // })


  // .when("/error", {
  //   templateUrl: 'app/views/pages/error.html',
  // })
  

  // Added to remove the # from URLs

  

  // myApp.run(function ($rootScope, $location, $route, AuthService) {
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
