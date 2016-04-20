
## THE MEAN STACK

MongoDB
Express
Angular
NodeJs

This repository has the skeleton code needed to create a MEAN app. Comments on different files briefly explain the objectives of the files and methods (controllers, services, views, API, etc). 

Also, I have added notes that I created to undestand the working of the different technologies while learning them. These notes are based from the book: [Mean Machine](https://leanpub.com/mean-machine) (which I **highly** recommend for anyone trying to learn these technologies).

Please feel free to comment on anything that can be done better, both in the code and the notes!

Once the app is set up, you should have a page that looks like this:

![Screenshot](http://imgur.com/dxa4X4D, "Mean App")

### Setting up the environment
######Starting the Node application:

	node server.js

######Monitoring changes in a file
  Start app with nodemon to continuously monitor changes

    $ nodemon server.js

######Installing packages:
Two ways:

  1. Writing them into the package.json

        "dependencies": {
          "express": "latest"
        }

  2. Installing via the command line (preferred) 
  	
  		$ npm install <name> --save

        
This creates a folder called node_modules. So that when we do `$ npm install` all the packages in this folder will automatically get installed.


####Setting up a server and sending HTML files to it for the user:

    app.get('/', function (req, res) {
      res.sendFile(path.join(__dirname + '/index.html'))
    })

This sends the file `index.html` to the server.

###Routers:

Express comes with build in routers. So first create an instance of a router.

	adminRouter=express.Router()
Then, apply routes to it.

	adminRouter.get('/', function(req, res) {
 		res.send("I am the dashboard!")
	})

	adminRouter.get('/users', function (req, res) {
  		res.send("I show all the users!")
	})
Then use the routes

	app.use('/admin', adminRouter)


What we have done is, we have created a new router, assigned routes to it and are using that router. So when we navigate to 
`http://localhost:1337/admin` and any asigned path that follows `/admin` like `http://localhost:1337/admin/users` will route the user to the specified page.

###Middleware
Middleware is a way to do something before a request is proccessed. Like checking if a user is authenticated before displaying certain information, etc.,

Middleware should be placed after the router is initialized and before it's routes are applied. 
	
	adminRouter.use(function (req, res, next) {
	  console.log(req.method, req.url)
	  next()
	})
This logs each request to the console. The `next()` is the way that the function will know the the middleware has done it's job (maybe checking for authentication) and will proceed further.

`adminRouter.use()` is used to define the middleware. This will now be applied to all of the requests that come into the app for that instance of the router i.e., the `admin` instance.

**It is very important where the middleware is placed** as everything will happen in the order that it is placed. If the middleware is placed after a route then the route will happen before the middleware is executed.


###Routers with params

If we have a router called `basicRouter` and we want to add routes with parameters like `/q/users/user_name`, we do this:

	basicRouter.get('/users/:name', function(req, res) {
	  res.sendFile(path.join(__dirname + '/cquote.html'))
	})
	
So now, when we visit `http://localhost:1337/q/users/chris` a new HTML file called cquote.html will be sent back to the server [basicRouter is for `http://localhost:1337/q`].

###Middleware for routers with params
	
	basicRouter.param('name', function (req, res, next, name) {
	
		console.log("Doing validations for:", name)
	 	
	 	//blah blah validate quote from user
	  
	  	req.name = name
	  	next()
	})

###Login Routes
A shortcut to call the Express Router and to define multiple actions on a single route. 
######Login Form

	app.route('/login') 
	  .get(function (req, res) {
	    res.send("This is the login form \nMock uid: _______\nMock password _______")
	  })
	
	  .post( function (req, res) {
	    console.log("We are porccesing the form")
	    res.send("Processing the login form!")
	  })

###RECAP
* Use express.Router() multiple times to define groups of routes
* Apply routes to an instance of a router by using `app.use`
* Use route middleware to process requests
* Use route middleware to validate params using `<routerName>.param()`
* Use app.route() as a shortcut to the Router to define multiple requests on a route



