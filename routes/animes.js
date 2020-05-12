var express = require("express");
var router = express.Router();
var Anime = require("../models/anime");
var middleware = require("../middleware");
var multer = require("multer");
var cloudinary = require("cloudinary");
require('dotenv').config();

// multer and cloudinary config

var storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});

var imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: 'dsk6pgp44', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});


// index route
router.get("/", (req, res) => {
	Anime.find({}, (err, animes) => {
		if (err) {
			req.flash("error", "Something went wrong.");
		}
		else {
			res.render("animes/index", {animes: animes, page: 'animes'});
		}
	})
});

// new form
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("animes/new");
});

// show
router.get("/:id", (req, res) => {
	Anime.findById(req.params.id).populate("comments").exec((err, foundAnime) => {
		if (err) {
			console.log("ERROR");
			console.log(err);
		}
		else {
			res.render("animes/show", {anime: foundAnime});
		}
	});
});

// anime new
router.post("/", middleware.isLoggedIn, upload.single('image'), (req, res) => {
	cloudinary.v2.uploader.upload(req.file.path, (err, result) => {
		if(err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}
	    // add cloudinary url for the image to the anime object under image property
	    req.body.anime.img = result.secure_url;
		req.body.anime.imgId = result.public_id;
		req.body.anime.author = {
			id: req.user._id,
			username: req.user.username
		};

		Anime.create(req.body.anime, (err, anime) => {
			if (err) {
				console.log(err);
			}
			else {
				req.flash("success", "Anime created successfully");
				res.redirect("/animes");
			}
		});
	});
	
});

// Edit anime
router.get("/:id/edit", middleware.checkAnimeOwnership, (req, res) => {
	Anime.findById(req.params.id, (err, foundAnime) => {
		res.render("animes/edit", {anime: foundAnime});
	});
});

router.put("/:id", middleware.checkAnimeOwnership, upload.single('image'), (req, res) => {
	Anime.findById(req.params.id, async (err, foundAnime) => {
		if (err) {
			req.flash("error", err.message);
			res.redirect("back");
		}
		else {
			if (req.file) {
				try {
					await cloudinary.v2.uploader.destroy(foundAnime.imgId);
					var result = await cloudinary.v2.uploader.upload(req.file.path);
                  	foundAnime.imgId = result.public_id;
                  	foundAnime.img = result.secure_url;
				} catch (err) {
					req.flash("error", err.message);
                  	return res.redirect("back");
				}
			}
			//console.log(req.body);
			foundAnime.name = req.body.name;
			foundAnime.rating = req.body.rating;
			foundAnime.description = req.body.description;
			foundAnime.lightNovel = req.body.lightNovel;
			foundAnime.manga = req.body.manga;
			foundAnime.tvSeries = req.body.tvSeries;
			foundAnime.save();

			req.flash("success", "Anime updated successfully.");
			res.redirect("/animes/" + req.params.id);
		}
	});
});

// Destory anime
router.delete("/:id", middleware.checkAnimeOwnership, (req, res) => {
	Anime.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			res.redirect("/animes");
		}
		else {
			req.flash("success", "Anime removed successfully");
			res.redirect("/animes");
		}
	});
});



module.exports = router;
