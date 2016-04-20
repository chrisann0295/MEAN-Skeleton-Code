// A very basic API using the sample model user
// GET, POST, PUT and DELETE with basic authentication using
// basic JWT based authentication is shown

var bodyParser = require('body-parser') // get body-parser
  , jwt        = require('jsonwebtoken')
  , config     = require('../../config')
  , User  = require('../models/sampleUser');

// super secret for creating tokens (if needed for auth)
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
// //######################## All routes below this will pass through the middleware before being served #############################
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
  // apiRouter.route('/me')
  //   .get(function(req, res) {
  //     res.send(req.decoded);
  // });


//########################################## Routes with localhost://users/:user id  #######################
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


  return apiRouter;
}
