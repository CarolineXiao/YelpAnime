var	mongoose   = require("mongoose");

var animeSchema = new mongoose.Schema({
	name: String,
	img: String,
	imgId: String,
	rating: Number,
	createdAt: { type: Date, default: Date.now},
	description: String,
	lightNovel: {
		writtenBy: String,
		illustratedBy: String,
		publishedBy: String,
		demographic: String,
		imprint: String,
		originalRun: String,
		volumes: Number
	},
	manga: {
		writtenBy: String,
		illustratedBy: String,
		publishedBy: String,
		demographic: String,
		magazine: String,
		originalRun: String,
		volumes: Number
	},
	tvSeries: {
		directedBy: String,
		producedBy: String,
		writtenBy: String,
		musicBy: String,
		studio: String,
		originalRun: String,
		episodes: Number
	},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Anime", animeSchema);