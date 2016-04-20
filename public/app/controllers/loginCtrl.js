angular.module('loginCtrl', ['authService'])

.controller('loginController', function($rootScope, $location, Auth) {
  var vm = this;

   // check to see if a user is logged in on every request
  $rootScope.$on('$routeChangeStart', function(err, user) {
      vm.loggedIn = Auth.isLoggedIn();
      if(!vm.loggedIn && $location.url() !== "/register") {
        $location.path('/login');
      }
  });

  vm.username
  vm.password

  // vm.loggedIn = Auth.isLoggedIn();

  // if(Auth.isLoggedIn()) {
  //   $location.path('/');
  // }

  vm.doLogin = function() {
    vm.processing = true;
    vm.error = '';

    Auth.login(vm.username, vm.password)
      .success(function(data) {
        vm.processing = false;

        if (data.success) {
          $location.path('/');
        }
        else
            vm.error = data.message;
      });

  };

  // function to handle logging out
  vm.doLogout = function() {
      Auth.logout();

      // reset all user info
      vm.user = {};
      $location.path('/login');
  }

  vm.newUser = function() {
    $location.path('/register');
  }
});