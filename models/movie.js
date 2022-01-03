const mongoose = require("mongoose");
const Joi = require("joi");
const { genreSchema } = require("./genre");

const movieSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
		minlenght: 3,
		maxlenght: 255,
	},
	genres: [
		{
			type: genreSchema,
			required: false,
		},
	],
	numberInStock: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
	dailyRentalRate: {
		type: Number,
		required: true,
		min: 0,
		max: 255,
	},
});
// Istance ..
const Movie = new mongoose.model("Movie", movieSchema);

// Validation
function validateMovie(arg) {
	// // arg is the req.body in json
	const schema = Joi.object({
		title: Joi.string().min(3).max(255).required(),
		genreId: Joi.objectId().required(),
		numberInStock: Joi.number().min(0).max(255),
		dailyRentalRate: Joi.number().min(0).max(255),
	});
	const result = schema.validate(arg);

	if (result.error) {
		console.log("*validateMovie: ", result.error.details[0].message);
	}
	return result;
}

exports.Movie = Movie;
exports.validate = validateMovie;
