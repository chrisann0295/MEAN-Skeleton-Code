var bodyParser = require('body-parser') // get body-parser
  , jwt        = require('jsonwebtoken')
  , config     = require('../../config')
  , passport   = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User       = require('../models/user')
  , Quote       = require('../models/quote')

// super secret for creating tokens
var superSecret = config.secret


module.exports = function(app, express) {

  var apiRouter = express.Router();

  apiRouter.get('/', function (req, res) {
    res.json({ message: 'Woohoooo! Welcome to our api!'})
  })

/*
################################ USERNAME CHECK ###########################################
################################ No authentication required for this route #############################
*/
  apiRouter.route('/check-username/:username')
    .get(function(req, res) {
      
      User.findOne({ username: req.params.username}, function(err, user) {
        if(!user) { //no user exists
          res.json({
            success: true
          , message: "New username!"
          })
        } else {
          res.json({
            success: false
          , message: "Users name already exists"
          })
        }
      })

    })

/*
################################ USER ROUTES ###########################################
################################ Routes with localhost://users/* #############################
################################ No authentication required for this route as we are creating a new user, so 
token does not exist ##################
*/
  apiRouter.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
      var user = new User();    // create a new instance of the User model
      user.name = req.body.name;  // set the users name (comes from the request)
      user.username = req.body.username;  // set the users username (comes from the request)
      user.password = req.body.password;  // set the users password (comes from the request)
      user.last_name = req.body.last_name;
      user.email = req.body.email;
      user.gender = req.body.gender;
      user.total_quotes = 0;

      user.save(function(err) {
        if (err) {
          // duplicate entry
          if (err.code == 11000) 
            return res.json({ success: false, message: 'A user with that username already exists. '});
          else 
            return res.send(err);
        }
        // return a message
        res.json({ success: true, message: 'User created!' });
      });

    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
    // .get(function(req, res) {

    //   User.find({}, function(err, users) {
    //     if (err) res.send(err);

    //     // return the users
    //     res.json(users);
    //   });
    // });


  //################### Authentication ##############################
/*
  authentication route (accessed at POST http://localhost:8080/api/authenticate)
  Finds user from db using username, checks for authenticate password
  If everything is fine, it will return a token
  Then Middleware will verify the token
  So make ANY api calls, you need a token.
*/

  apiRouter.post('/authenticate', function(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {

      if (err) throw err;

      if(!user) { //User doesnt exist
       res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        })
      } else { //User found, check password
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (err) throw err

            if(!isMatch) { //Password is wrong
              res.json({
                success: false,
                message: 'Authentication failed. Wrong password.'
             })
            } else {

              var token = jwt.sign({
                name: user.name
              , username: user.username
              }, superSecret, {
                expiresInMinutes: 3000
              })

              res.json({
                success: true
              , user: user
              , message: 'Successfully logged in!'
              , token: token
              })
            }
            console.log("Its a match! Correct userid and pass")
          })
      }
    })
  });

// //######################## MIDDLEWARE AUTHENTICATING TOKEN #############################
  apiRouter.use(function(req, res, next) {

  console.log('Somebody just came to our app!');

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.param('token') || req.headers['x-access-token'];

    if (token) {
      // verifies secret and checks exp
      jwt.verify(token, superSecret, function(err, decoded) {
        if (err) {
          return res.status(403).send({
            success: false,
            message: 'Failed to authenticate token. Forbidden Access.'
        });
        } else {
          
          // if everything is good, save to request for use in other routes
          req.decoded = jwt.decode(token)

          next(); // make sure we go to the next routes and don't stop here
        }
      });
    } else {
    // if there is no token
    // return an HTTP response of 403 (access forbidden) and an error message
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
  });
    
  
/*
################################ PROFILE ROUTE /ME ###########################################
*/
  apiRouter.route('/me')
    .get(function(req, res) {
      res.send(req.decoded);
  });


// ########################### USER PROFILE NO

// apiRouter.route('/me')

//   .get(function(req, res) {
//     User.findOne({ username: req.body.username }, function(err, user) {

//       if(err) throw err

//       res.json({
//         success: true
//       , user: user
//       })

//     })
//   })


// //########################################## Routes with localhost://users/:user id  #######################
  apiRouter.route('/users/:username')
    //(accessed at GET http://localhost:8080/api/users/:userid)
    // get the user with that id
    .get(function(req, res) {
      User.findOne({ username: req.params.username }, function(err, user) {
        if(err) throw err

        res.json({
          success: true
        , user: user
        })
        
        // console.log(user)
      })
    })

    // update the user with this id
    //(accessed at PUT http://localhost:8080/api/users/:userid)
    .put(function(req, res) {
      User.findOne({ username: req.params.username }, function(err, user) {

        if (err) res.send(err);

        // set the new user information if it exists in the request
        if (req.body.name) user.name = req.body.name
        if (req.body.last_name) user.last_name = req.body.last_name
        if (req.body.email) user.email = req.body.email
        if (req.body.gender) user.gender = req.body.gender

        // save the user
        user.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'User updated!' });
        });

      });
    })

    ////(accessed at DELETE http://localhost:8080/api/users/:userid)
    // delete the user with this id
    .delete(function(req, res) {
      User.remove({
        _id: req.params.user_id
      }, function(err, user) {
        if (err) res.send(err);

        res.json({ message: 'Successfully deleted' });
      });
    });



  

// ################################ QUOTE ROUTES ###########################################




// ############################ Routes with http://localhost:8080/api/quotes/ #######################
  apiRouter.route('/quotes')

    // create a quote by POST at http://localhost:8080/api/quotes/
    .post(function(req, res) {
      
      var quote = new Quote();    // create a new instance of the quote model
      quote.username = req.body.username;  // set the users username to the quote
      quote.date = req.body.date;
      quote.location = req.body.location;
      quote.context = req.body.context;
      quote.fav = req.body.fav;
      quote.quote = req.body.quote;

      quote.save(function(err, quote) {
        if (err) {
          if (err.code == 11000) 
            return res.json({ success: false, message: 'A booking with that id already exists. '});
          else 
              return res.send(err);
        }

        // return a message
        res.json({ 
          success: true
        , message: 'Quote created!' 
        , quoteId: quote.id
      });

      });

    })

    // edit a quote by POST at http://localhost:8080/api/quotes/
    .put(function(req, res) {
      Quote.findById(req.body.id, function(err, quote) {

        if (err) res.send(err);

        // set the new quote information if it exists in the request
        if (req.body.quote) quote.quote = req.body.quote
        if (req.body.date) quote.date = req.body.date
        if (req.body.location) quote.location = req.body.location
        if (req.body.context) quote.context = req.body.context
        if (req.body.fav) { quote.fav = req.body.fav }
          else { quote.fav = false }  //THIS AINT WORKING,

        // save the new updated quote
        quote.save(function(err) {
          if (err) res.send(err);

          // return a message
          res.json({ message: 'Quote updated!' });
        });

      });
    })


    // returns all the quotes [Admin view only, should be removed later]
    .get(function(req, res) {

      Quote.find({ username : req.body.username }, function(err, quotes) {
        if (err) res.send(err);

        // return the users
        res.json(quotes);
      });
    })

// ############################ Routes with http://localhost:8080/quotes/:quoteId #######################
// return a particular quote
  
  apiRouter.route('/quotes/:quoteId')

    .get(function(req, res) {
      Quote.findById(req.params.quoteId, function(err, quote) {
        if(err) throw err

        if (!quote) {
          res.json( {
            success: false
          , message: "Not found!"
          })
        } else {
          res.json({
            success: true
          , quote: quote
          })
        }
      })
    });

        // .put(function(req, res) {
    //   Quote.findById(req.params.user_id, function(err, user) {

    //     if (err) res.send(err);

    //     // set the new user information if it exists in the request
    //     if (req.body.quote) quote.quote = req.body.name;
    //     if (req.body.date) quote.date = req.body.date
    //     // if (req.body.location) quote.location = req.body.location
    //     if (req.body.email) user.total_quotes = req.body.total_quotes

    //     // save the user
    //     Quote.save(function(err) {
    //       if (err) res.send(err);

    //       // return a message
    //       res.json({ message: 'User updated!' });
    //     });

    //   });
    // })



    // ############################ Routes with http://localhost:8080/:username/quotes/ #######################
  // return all the quotes saved by a particular user

  apiRouter.route('/allquotes/:username')
    .get(function(req, res) {
      Quote.find({ username: req.params.username}, function(err, quotes) {
        if (err) res.send(err);

        // return the user's quotes
        res.json(quotes);
      });
  });



// // on routes that end in /bookings/create
// // creates a new booking
//   apiRouter.route('/bookings/create')
    
//     // create a user (accessed at POST http://localhost:8080/api/bookings/create)
//     .post(function(req, res) {
      
//       var booking = new Booking();    // create a new instance of the Booking model
//       booking.booking_id = req.body.booking_id; //sets the booking id in the booking model from the request
//       booking.netlink_id = req.body.netlink_id; //sets netlink id in the booking model from the request
//       booking.room_id = req.body.room_id;  //sets room id in the booking model from the request
//       booking.projector_id = req.body.projector_id;  //sets projector id in the booking model from the request
//       booking.laptop_id = req.body.laptop_id;  //sets laptop id in the booking model from the request
//       booking.start_year = req.body.start_year; //sets start_year in the booking model from the request
//       booking.start_month = req.body.start_month;
//       booking.start_day = req.body.start_day;
//       booking.start_hour = req.body.start_hour;
//       booking.start_minute = req.body.start_minute;
//       booking.end_hour = req.body.end_hour; //sets end_hour in the booking model from the request 
//       booking.end_minute = req.body.end_minute;
//       booking.save(function(err) {
//         if (err) {
//           // duplicate entry
//           if (err.code == 11000) 
//             return res.json({ success: false, message: 'A booking with that id already exists. '});
//           else 
//             return res.send(err);
//         }

//         // return a message
//         res.json({ message: 'Booking created!' });
//       });

//     });

//   apiRouter.route('/roombookings/:room_id/:year/:month/:day')
//     .get(function(req, res){
//       Booking.find({"room_id":req.params.room_id, "start_year":req.params.year, "start_month": req.params.month, "start_day": req.params.day}, 
//       function(err, bookings) {
//         if(err) res.send(err);      
        
//         res.json(bookings);
//       });
//     });

//   apiRouter.route('/laptopbookings/:laptop_id/:year/:month/:day')
//     .get(function(req, res){
//       Booking.find({"laptop_id":req.params.laptop_id, "start_year":req.params.year, "start_month": req.params.month, "start_day": req.params.day}, 
//       function(err, bookings) {
//         if(err) res.send(err);      
        
//         res.json(bookings);
//       });
//     });
  
//   apiRouter.route('/projectorbookings/:projector_id/:year/:month/:day')
//     .get(function(req, res){
//       Booking.find({"projector_id":req.params.projector_id, "start_year":req.params.year, "start_month": req.params.month, "start_day": req.params.day}, 
//       function(err, bookings) {
//         if(err) res.send(err);      
        
//         res.json(bookings);
//       });
//     });


// /*
// ############################ Routes with http://localhost:8080/api/bookings/:netlink_id
// on routes that end in /bookings/user
// returns all the boookings for a user
// */

//   apiRouter.route('/bookings/:netlink_id')

//     //(accessed at GET http://localhost:8080/api/bookings/:netlink_id)
//     .get(function(req, res) {

//       Booking.find({"netlink_id":req.params.netlink_id}, function(err, bookings) {
//       if (err) res.send(err);

//         // return the bookings belonging to the user with the netlink_id
//         res.json(bookings);
//       });
//     });

// // on routes that end in /api/bookings/delete/:/booking_id
// // deletes a specific booking
// // ----------------------------------------------------
//   apiRouter.route('/bookings/delete/:booking_id')
//       // delete the booking with this id
//     .delete(function(req, res) {
//       Booking.remove({
//         _id: req.params.booking_id
//       }, function(err, booking) {
//         if (err) res.send(err);

//         res.json({ message: 'Successfully deleted' });
//       });
//     });





  return apiRouter
}
