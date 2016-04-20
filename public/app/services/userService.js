angular.module('userService', [])

  .factory('User', function($http) {

    var userFactory = {}

    userFactory.get = function(username) {
      return $http.get('/api/users/' + username)
    };

    userFactory.updateUser = function(username, newInfo) {
      return $http.put('/api/users/' + username, newInfo)
    };


    userFactory.getAllUserQuotes = function(username) {
      return $http.get('/api/allquotes/' + username)
    }

    userFactory.create = function(newInfo) {
      return $http.post('/api/users/', newInfo)
    }

    userFactory.checkUsername = function(username) {
      return $http.get('/api/check-username/'+ username)
    }
    
    return userFactory;

  });