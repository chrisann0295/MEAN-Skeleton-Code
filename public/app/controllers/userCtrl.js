// Sample Controller
angular.module('userCtrl', ['userService' ])
  
  .controller('userController', function($rootScope, User, $location, $scope) {
    
    var vm = this

    // This function can be called by the view
    vm.saveNewProfile = function () {
      newInfo = {}

      if (vm.newName !== vm.name) {
        newInfo.name  = vm.newName  
      }

      if (vm.newLastName !== vm.last_name) {
        newInfo.last_name = vm.newLastName
      }

      if (vm.newEmail !== vm.email) {
        newInfo.email = vm.newEmail
      }

      // Uses the methods defined in the services
      User.create(newInfo)
        .success(function(data) {
          if(data.success) { 
            Auth.login(newInfo.username, newInfo.password)
              .success(function(data) {
                $location.path('/profile')
              })
          } else {
            vm.error = data.message
          }
        })
    }

  })

