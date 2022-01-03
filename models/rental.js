const mongoose = require("mongoose");
const Joi = require("joi");

// Definition and Instance
const Rental = mongoose.model(
	"Rental",
	new mongoose.Schema({
		customer: {
			type: new mongoose.Schema({
				name: {
					type: String,
					required: true,
					minlength: 3,
					maxlength: 50,
				},
				isGold: {
					type: Boolean,
					default: false,
				},
				phone: {
					type: String,
					required: true,
					minlength: 5,
					maxlength: 50,
				},
			}),
			required: true,
		},
		movie: {
			type: new mongoose.Schema({
				title: {
					type: String,
					required: true,
					trim: true,
					minlength: 5,
					maxlength: 255,
				},
				dailyRentalRate: {
					type: Number,
					required: true,
					min: 0,
					max: 255,
				},
			}),
			required: true,
		},
		dateOut: {
			type: Date,
			required: true,
			default: Date.now,
		},
		dateReturned: {
			type: Date,
		},
		rentalFee: {
			type: Number,
			min: 0,
		},
	})
);

// Validation
function validateRental(arg) {
	// // arg is the req.body in json
	const schema = Joi.object({
		customerId: Joi.objectId(),
		movieId: Joi.objectId(),
		// dateOut: Joi.date().required(),
		// dateReturned: Joi.date(),
		// rentalFee: Joi.number().min(0),
	});
	const result = schema.validate(arg);

	if (result.error) {
		console.log("*validateRental: ", result.error.details[0].message);
	}
	return result;
}

exports.Rental = Rental;
exports.validate = validateRental;
