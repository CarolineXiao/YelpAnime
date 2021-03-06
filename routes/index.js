var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
require('dotenv').config();

// route route
router.get("/", (req, res) => {
	res.render("landing");
})


// REGISTER
router.get("/register", (req, res) => {
	res.render("register", {page: 'register'});
});

router.post("/register", (req, res) => {
	var newUser = new User({username: req.body.username, email: req.body.email});
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to YelpAnime " + user.username + "!");
			res.redirect("/animes");
		});
	});
});

// LOGIN
router.get("/login", (req, res) => {
	res.render("login", {page: 'login'});
});


router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/animes",
		failureRedirect: "/login"
	}), (req, res) => {	
});

// LOGOUT
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Logged you out.");
	res.redirect("/animes");
});

// Forgot password
router.get("/forgot", (req, res) => {
	res.render("forgot");
});

router.post('/forgot', (req, res, next) => {
	async.waterfall([
		(done) => {
			crypto.randomBytes(20, function(err, buf) {
				var token = buf.toString('hex');
				done(err, token);
		  	});
		},
		(token, done) => {
		  User.findOne({ email: req.body.email }, (err, user) => {
			  if (!user) {
				  req.flash('error', 'No account with that email address exists.');
			  	  return res.redirect('/forgot');
			  }
			  user.resetPasswordToken = token;
			  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

			  user.save((err) => {
				  done(err, token, user);
			  });
		  });
		},
		(token, user, done) => {
			var smtpTransport = nodemailer.createTransport({
				service: 'Gmail', 
				auth: {
			  	user: 'myanimeapp.info@gmail.com',
			  	pass: process.env.GMAILPW
				}
		  	});
		  	var mailOptions = {
				to: user.email,
				from: 'myanimeapp.info@gmail.com',
				subject: 'MyAnime Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
				  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
				  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
				  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		  	};
			
		  	smtpTransport.sendMail(mailOptions, (err) => {
				console.log(err);
				console.log('mail sent');
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err, 'done');
		  	});
		}
	], function(err) {
		if (err) return next(err);
		res.redirect('/forgot');
  		});
});


router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', (req, res) => {
  async.waterfall([
    (done) => {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user) => {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, (err) => {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save((err) => {
              req.logIn(user, (err) => {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    (user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'myanimeapp.info@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'myanimeapp.info@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, (err) => {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], (err) => {
    res.redirect('/animes');
  });
});

module.exports = router;
