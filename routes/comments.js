var express = require("express");
var router = express.Router({mergeParams: true});
var Anime = require("../models/anime");
var Comment = require("../models/comment");
var middleware = require("../middleware");


// Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Anime.findById(req.params.id, (err, anime) => {
		if (err) {
			console.log(err);
		}
		else {
			res.render("comments/new", {anime: anime});
		}
	});
});


// Comments Create
router.post("/", middleware.isLoggedIn, (req, res) => {
	Anime.findById(req.params.id, (err, anime) => {
		if (err) {
			req.flash("err", "Opps.Something went wrong.");
			res.redirect("/animes");
		}
		else {
			Comment.create(req.body.comment, (err, comment) => {
				if (err) {
					console.log(err);
				}
				else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					anime.comments.push(comment);
					anime.save();
					req.flash("success", "Comment created successfully");
					res.redirect("/animes/" + anime._id);
				}
			});
		}
	});
});

// Edit Comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if (err) {
			res.redirect("back");
		}
		else {
			res.render("comments/edit", {anime_id: req.params.id, comment: foundComment});
		}
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
		if (err) {
			res.redirect("back");
		}
		else {
			req.flash("success", "Comment updated successfully");
			res.redirect("/animes/" + req.params.id);
		}
	});
});

// Destory
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if (err) {
			res.redirect("back");
		}
		else {
			req.flash("success", "Comment deleted successfully");
			res.redirect("/animes/" + req.params.id);
		}
	});
});


module.exports = router;
