var express       = require("express"),
 	app           = express(),
	bodyParser    = require("body-parser"),
	mongoose      = require("mongoose"),
	Anime    = require("./models/anime"),
	Comment       = require("./models/comment"),
	Uer           = require("./models/user"),
	seedDB        = require("./seeds"),
	Comment       = require("./models/comment"),
	passport      = require("passport"),
	LocalStrategy = require("passport-local"),
	User          = require("./models/user"),
	methodOverride = require("method-override"),
	flash          = require("connect-flash");


var commentRoutes 	 = require("./routes/comments"),
 	animeRoutes = require("./routes/animes"),
    indexRoutes       = require("./routes/index");


//seedDB(); // seed the database
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/yelp_camp");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({entended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Pepsi is the cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.locals.moment = require("moment");

app.use("/", indexRoutes);
app.use("/animes/:id/comments", commentRoutes);
app.use("/animes", animeRoutes);


app.listen(3000, () => {
	console.log("The YelpAnime Server has started!!")
})