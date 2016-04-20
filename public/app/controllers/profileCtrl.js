angular.module('profileCtrl', ['userService', 'quoteService' ])
  
  .controller('profileController', function($rootScope, User, Auth, Quote, $location, $scope) {
    var vm = this
  
     vm.searchResults

    vm.changeHeartRed = function ()
    {
      document.getElementById("favIcon").style.color = "red";
    }

    vm.removeStyle = function () {
      document.getElementById("favIcon").removeAttribute("style");
    }

    vm.editProfile = function (){
      console.log("geere")
      document.getElementById("showUserDetails").style.display = "none";
      document.getElementById("showEditDetails").removeAttribute("style");
    }

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

      if (vm.newGender !== vm.gender) {
        newInfo.gender = vm.newGender
      } 

      User.updateUser(vm.username, newInfo)
        .success(function() {
          window.location.reload();

        })
    }

    if (!Auth.isLoggedIn()) {
       $location.path('/login')
     } else {

      Auth.getUser()
        .success(function (data) {
          User.get(data.username)
            .success(function(user){
              vm.name = user.user.name
              vm.username = user.user.username
              vm.last_name = user.user.last_name    
              vm.email = user.user.email
              vm.gender = user.user.gender.toString()
              vm.full_name = vm.name  + " " + vm.last_name

              vm.newName = vm.name
              vm.newLastName = vm.last_name
              vm.newEmail = vm.email
              vm.newGender = vm.gender

              User.getAllUserQuotes(vm.username)
                .success(function (quotes) {
                  vm.allUserQuotes = quotes
                  vm.searchableQuotes = quotes//This is because the ng filter searches the username and returns the stuff
                  vm.total_quotes = quotes.length
                  vm.favQuotes = { quotes : []}
                  vm.quoteId

                  // USE LODASH HERE

                  for (var i = 0; i < vm.total_quotes; i++ ) {
                  

                    if (vm.allUserQuotes[i].fav) {
                      console.log(vm.allUserQuotes[i])
                      vm.favQuotes.quotes.push(vm.allUserQuotes[i])
                    }

                    delete vm.searchableQuotes[i]['username']
                  }
                })
            })
        })
    }

    vm.newQuote = function() {
      $location.path('/quotes/new');
    };

    vm.logout = function() {
      Auth.logout()
      $location.path('/login')
    }

    vm.getQuote = function(quoteId) {
      Quote.getQuote(quoteId)
        .success(function(quote) {
          $rootScope.showQuote =  quote.quote
          $location.path('/quotes/show')
        })
    }

    vm.editQuote = function(quoteId) {
      console.log("editing q:",quoteId)

      $rootScope.quoteId = quoteId
      $location.path('/quotes/edit')
      
      // Quote.getQuote(quoteId)
      //   .success(function(quote) {
      //     $rootScope.editQuote =  quote
      //     $location.path('/quotes/edit')
      //   })

      
    }

    })

