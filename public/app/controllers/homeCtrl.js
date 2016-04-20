angular.module('homeCtrl', [])
  
  .controller('', function($rootScope, $location) {
    var vm = this
    
    // if (!Auth.isLoggedIn() ) { //if not logged in redirect to login
    //   $location.path('/login')
    // } else {
    //   Auth.getUser()
    //    .success(function (data) {
    //       User.get(data.username)
    //         .success(function(user){
    //           vm.name = user.user.name
    //           vm.username = user.user.username
    //           vm.last_name = user.user.last_name    
    //           vm.email = user.user.email
    //           vm.gender = user.user.gender
    //           vm.total_quotes = user.user.total_quotes
    //         });
    //     })
    // }

    // // Auth.getUser()
    // //    .success(function (data) {
    // //       User.get(data.username)
    // //         .success(function(user){
    // //           vm.name = user.user.name
    // //           vm.username = user.user.username
    // //           vm.last_name = user.user.last_name    
    // //           vm.email = user.user.email
    // //           vm.gender = user.user.gender
    // //           vm.total_quotes = user.user.total_quotes
    // //         });
    // //     })


    // vm.newQuote = function() {
    //   $location.path('/quotes/new');
    // };



    
  })