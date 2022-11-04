require("dotenv").config();
const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login'); //authorization
const User = require('./user.js'); // User Model 
const MongoDBStore = require('connect-mongodb-session')(session);


const app = express();

const store = new MongoDBStore(
  {
    uri: process.env.MONGODB_URI,
    collection: 'sessions',
    //expires: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds By default, sessions expire after 2 weeks.
    connectionOptions: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000
    }
  },
  function(error) {
    // Should have gotten an error
  });

store.on('error', function(error) {
  // Also get an error here
});
// Configure Sessions Middleware
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  store: store
}));


//setting middleware

// set the view engine to ejs
// use res.render to load up an ejs view file
app.set('view engine', 'ejs');

//Serves resources from public folder
app.use(express.static("public"));
//Express 4.16+ you don't have to import body-parser
app.use(express.urlencoded({ extended: true }));
// To parse the incoming requests with JSON payloads
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(User.createStrategy());

// To use with sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// User.register({ username: 'candy', active: false }, 'cane');
// User.register({ username: 'starbuck', active: false }, 'redeye');
// User.register({ username: '123@gmail.com', active: false }, 'redeye');

app.get('/', connectEnsureLogin.ensureLoggedIn('/auth'), function(req, res) {
  
  res.render('secret');
});

app.get('/auth', function (req, res) {
  res.render('auth');
});

// // Route to Dashboard
// app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
//   res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
//   and your session expires in ${req.session.cookie.maxAge} 
//   milliseconds.<br><br>
//   <a href="/logout">Log Out</a><br><br><a href="/secret">Members Only</a>`);
// });



app.get('/login', function(req, res) {
  res.redirect('/auth');
});

app.get('/sign-up', function(req, res) {
  res.redirect('/auth');
});


app.get('/logout', function(req, res) {
  req.logout(function (err) {
    if (err) { console.log(err);}
    else {
      res.redirect('/');
    }
  });
});


app.post('/login', passport.authenticate('local', { failureRedirect: '/auth' }),  function(req, res) {
	res.redirect('/');
});


app.post('/register', function(req, res) {
  const email = req.body.email;
  const passWord = req.body.password;
  User.register({username: email, active: true}, passWord, function(err, user) {
    if (err) { 
      console.log(err);
      res.redirect('/auth');
    }

    else {
      const authenticate = User.authenticate();
    authenticate('username', 'password', function(err, result) {
      if (err) { console.log(err); }
      else {res.redirect('/');}
  
      // Value 'result' is set to false. The user could not be authenticated since the user is not active
    });
    }
    
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
  if (err) {
    console.log("Server err on port: " + PORT);
  } else {
    console.log("Server is listen on port: http://localhost:" + PORT);
  }
});
