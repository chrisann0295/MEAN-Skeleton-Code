angular.module('quoteService', [])

  .factory('Quote', function($http) {

    var quoteFactory = {}

    quoteFactory.create = function(quoteData) {
      return $http.post('/api/quotes/', quoteData)

    };

    quoteFactory.getQuote = function(quoteId) {
      return $http.get('api/quotes/' + quoteId)
    }

    quoteFactory.editQuote = function(updatedQuote) {
      return $http.put('api/quotes/',  updatedQuote)
    }

    return quoteFactory;

  });