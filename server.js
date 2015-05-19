var express = require('express');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy
var bodyParser = require('body-parser');
var cors = require('cors')
var mongoose = require('mongoose')


//controllers // schema's
//require user model
var User = require('./server/models/userSchema')

//express

var app = express();


//middleware
var requireAuth = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else res.redirect('public/views/login.html')
}



app.use(bodyParser.json());
app.use(cors());

app.use(session({
  secret: "aoweiry98n1sr71ADRB3awe3",
  saveUnitialized: false,
  resolve: true
}));

app.use(express.static(__dirname + "/public"))
app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
  clientID: "618772378257479",
  clientSecret: "bf22575c973bfa120357f91bc7ab26cf",
  callbackURL: "http://localhost:3000/auth/facebook/callback"
}, function(token, refreshToken, profile, done) {
  console.log("profile", profile);
  User.findOne({
    'facebook.id': profile.id
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    //No user was found... so create a new user with values from Facebook (all the profile. stuff)
    if (!user) {
      user = new User({
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        gender: profile.gender,
        location: profile.location,
        picture: profile.picture,
        ageRange: profile.age_range,
        email: profile.emails[0].value,
        username: profile.username,
        provider: 'facebook',
        //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
        facebook: profile._json
      });
      user.save(function(err) {
        if (err) console.log(err);
        return done(err, user);
      });
    } else {
      //found user. Return
      return done(err, user);
    }
  })
}));

passport.serializeUser(function(user, done) {
  return (null, user);
})

passport.deserializeUser(function(obj, done) {
  return null, obj
});



// Facebook end points


app.get('/api', function(req, res) { // testing to if server works
  res.send('hello')
})

app.get('/api/confirm/success', function(req, res) {
  res.send('Success')
})

app.get('/api/confirm/failure', function(req, res) {
  res.send('you failed')
})

app.get('/auth/facebook', passport.authenticate('facebook', {
  scope: ['email']
}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, home.
    res.redirect('/landing')
  })
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
/*app.get('/', requireAuth, function(req, res) {
  return (res.sendFile(__dirname + "public/views/landing.html"))
})
*/
/*app.get('/landing', requireAuth, function(req, res){
  res.render('account', { user: req.user });
});

      app.get('/login', function(req, res) {
        res.render('login.html')
      })
      */
// schema endpoints




//connection

var port = 3000
var mongoUri = "mongodb://localhost:27017/Whattado";

mongoose.connect(mongoUri);
mongoose.connection.once('open', function() {
  console.log('Connected to MongoDB at', mongoUri);
});




app.listen(port, function() {
  console.log("listening to port: ", port);
});
