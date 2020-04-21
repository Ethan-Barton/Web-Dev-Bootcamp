const express                 = require("express"),
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      bodyParser              = require("body-parser"),
      User                    = require("./models/user"),
      LocalStrategy           = require("passport-local"),
      passportLocalMongoose   = require("passport-local-mongoose");
    

// mongoose config
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/auth_demo_app");

// app config
const app   = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "Bear is the best do in the world!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ====================
// ROUTES
// ====================

// home route
app.get("/", function(req, res){
    res.render("home");
})

// secret route
app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
})

// Auth Route

// show sign up form
app.get("/register", function(req, res){
    res.render("register");
});

// handles user sign up
app.post("/register", function(req, res){
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

// login routes

// render login form
app.get("/login", function(req, res){
    res.render("login");
});

// handles login logic
// middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});

// Logout Route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

// server config
app.listen(3000, function(){
    console.log("Server has started on port 3000!");
});