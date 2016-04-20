angular.module('quoteCtrl', ['quoteService'])
  
  .controller('quoteController', function($rootScope, User, Auth, $location, $scope, Quote) {
    var vm = this

    vm.location
    vm.date
    vm.context
    vm.fav
    vm.quoteId
    vm.reqFieldTooltip

    vm.boom = "boom"
    $scope.speakers = [{id: 'speaker1'}];

    $scope.addNewspeaker = function() {
      var newItemNo = $scope.speakers.length+1;
      $scope.speakers.push({'id':'speaker'+newItemNo});
    };
      
    $scope.removespeaker = function() {
      var lastItem = $scope.speakers.length-1;
      $scope.speakers.splice(lastItem);
    };

    vm.saveQuote = function() {
      vm.quote = $scope.speakers
      Auth.getUser()
        .success(function (token) {
          vm.fullQuote = {
            quote: vm.quote
          , date: vm.date
          , location: vm.location
          , context: vm.context
          , fav: vm.fav
          , username: token.username
          }

          Quote.create(vm.fullQuote)
            .success(function(res) {
              console.log(vm.fullQuote)
              if(res.success) {
                vm.quoteId = res.quoteId //Currently saved quote
                $rootScope.quoteId = vm.quoteId
                //ADD TO INCREASE NUMBER OF QUOTES IN PROFILE
                Quote.getQuote(vm.quoteId)
                  .success(function(res) {
                    if(res.success) {
                      $rootScope.createdQuote = res.quote
                      $location.path('/quotes/show')
                        console.log($rootScope.createdQuote)
                    }
                  })
              }
            })
        })
    } 

    vm.cancelNewQuote = function() {
      // ADDDDD CONFIRM CANCEL?
      $location.path('/')
    }

  // If location is quote/new, do nothing. Proceed
  // if location is quote/new and $rootScope.createdQuote is not set, redirect
  // If location is quote/new and $rootScope.createdQuote is set, extract quote info
    if ($location.url() === "/quotes/show") {
      if ($rootScope.createdQuote) {
        vm.showDate =  $rootScope.createdQuote.date
        vm.showLocation =  $rootScope.createdQuote.location
        vm.showContext =  $rootScope.createdQuote.context
        vm.showFav =  $rootScope.createdQuote.fav
        vm.showUsername =  $rootScope.createdQuote.username
        vm.showQuote =  $rootScope.createdQuote.quote
      } else if ($rootScope.showQuote) {
        console.log("in the page:", $rootScope.showQuote )
        vm.showDate =  $rootScope.showQuote.date
        vm.showLocation =  $rootScope.showQuote.location
        vm.showContext =  $rootScope.showQuote.context
        vm.showFav =  $rootScope.showQuote.fav
        vm.showUsername =  $rootScope.showQuote.username
        vm.showQuote =  $rootScope.showQuote.quote
      } else {
        $location.path('/profile')
      }
    }

    vm.dupe =  {
    "_id": "55d956241c1d401de775bf56",
    "quote": [
      {
        "id": "speaker1",
        "speakerName": "Test speaker 1",
        "text": "Test speaker 1's  quooooooote"
      },
      {
        "id": "speaker2",
        "speakerName": "Test speaker 2",
        "text": "Test speaker 2's quoooooteeeeee"
      },
      {
        "id": "speaker3",
        "speakerName": "Test speaker 3",
        "text": "Test speaker 3's quoooooote"
      }
    ],
    "fav": true,
    "context": "Trying to build this app brah",
    "location": "ECS, Uvic",
    "date": "August 2015",
    "username": "FIX THIS",
    "__v": 0
  }
  })


  .controller('editQuoteController', function($rootScope, User, Auth, $location, $scope, Quote) {
    var vm = this 

    vm.updated = false

    if (!$rootScope.quoteId) {
      $location.path('/profile')
    } else {

      Quote.getQuote($rootScope.quoteId)
        .success(function(quote) {
          vm.quote = quote.quote
          vm.quoteId = vm.quote._id
          vm.showDate =  vm.quote.date
          vm.showLocation =  vm.quote.location
          vm.showContext =  vm.quote.context
          vm.showFav =  vm.quote.fav
          vm.showUsername =  vm.quote.username

          vm.quoteSpeakers = quote.quote.quote //Where the quote will be updated

        })

      vm.fieldsToUpdate = {
        quote : false
      , date : false
      , location : false
      , fav : false
      , context : false
      }

      vm.addNewSpeaker = function(){
        var newItemNo = vm.quoteSpeakers.length+1
        vm.quoteSpeakers.push({'id':'speaker'+newItemNo})
      }

      vm.removeSpeaker = function() {
        var lastItem = vm.quoteSpeakers.length-1;
        vm.quoteSpeakers.splice(lastItem);
      } 

      vm.changed = function() {
        console.log("changed")
        vm.updated = true
      }

      vm.saveUpdateQuote = function() {
        if(vm.updated) {
          vm.updatedQuote = {}

          vm.updatedQuote.id = vm.quoteId

          if(vm.fieldsToUpdate.quote) {
            vm.updatedQuote.quote = vm.quoteSpeakers
          }

          if(vm.fieldsToUpdate.date) {
            vm.updatedQuote.date = vm.showDate
          }

          if(vm.fieldsToUpdate.location) {
            vm.updatedQuote.location = vm.showLocation 
          }

          if(vm.fieldsToUpdate.context) {
            vm.updatedQuote.context = vm.showContext
          }

          if(vm.fieldsToUpdate.fav) {
            vm.updatedQuote.fav = vm.showFav
          }
        }

        Quote.editQuote(vm.updatedQuote)
          .success(function() {
            Quote.getQuote(vm.quoteId) 
              .success(function(updatedQuote) {
                $rootScope.showQuote =  updatedQuote.quote
                $location.path('/quotes/show')
              })
          })
      }
      vm.cancelEditQuote = function() {
        // ADDDDD CONFIRM CANCEL?
        $location.path('/profile')
      }

      vm.showValues = function() {
        console.log("here")
        console.log(vm.fieldsToUpdate)
      }
    }


  })





  

