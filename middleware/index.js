var Anime = require("../models/anime");
var Comment = require("../models/comment");

var middlewareObj = {};


middlewareObj.checkAnimeOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Anime.findById(req.params.id, (err, foundAnime) => {
			if (err) {
				req.flash("error", "Anime not found.");
				res.redirect("back");
			}
			else {
				// does user own the anime
				if (foundAnime.author.id.equals(req.user._id) || req.user.isAdmin === true) {
					next();
				}
				else {
					req.flash("error", "Sorry, you don't have permisssion to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in first.");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) {
				res.redirect("back");
			}
			else {
				// does user own the anime
				if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin === true) {
					next();
				}
				else {
					req.flash("error", "You don't have permisssion to do that");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be logged in first");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in first");
	res.redirect("/login");
}

module.exports = middlewareObj;