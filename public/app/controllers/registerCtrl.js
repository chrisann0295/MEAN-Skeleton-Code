angular.module('registerCtrl', ['userService', 'authService' ])

  .controller('registerController', function(User, Auth, $location) {
    var vm = this

    if(Auth.isLoggedIn()) { //It only checks if toke exists
      Auth.getUser()  //Double checks that the user is valid
        .success(function(data) {
          if(data.username) {
            $location.path('/profile'); //Go out of the register page
          } 
        })
    } else {
      vm.name
      vm.last_name
      vm.email
      vm.username
      vm.password
      vm.gender = 2
      vm.usernameAvailable = true
    }
    
    newInfo = {}

    vm.createUser = function() {
      newInfo.name = vm.name
      newInfo.last_name = vm.last_name
      newInfo.email = vm.email
      newInfo.username = vm.username
      newInfo.password = vm.password
      newInfo.gender = vm.gender

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

    vm.checkUsername = function() {
      vm.showText = true
      vm.processing = true

      User.checkUsername(vm.username)
        .success(function(data) {
          vm.processing = false
          if(data.success) {
            vm.usernameAvailable = true
            document.getElementById("inputBox").style.borderColor = "#18bc9c";
          } else {
            vm.usernameAvailable = false
            document.getElementById("inputBox").style.borderColor = "red";
          }
        })
    }

    vm.cancelRegister = function() {
      $location.path('/login')
    }



  })