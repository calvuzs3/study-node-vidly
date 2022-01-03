const Joi = require("joi");
const moment = require("moment");
const express = require("express");
const auth = require("../middleware/auth");
const { Movie } = require("../models/movie");
const { Rental } = require("../models/rental");
const validate = require("../middleware/validate");
const router = express.Router();

// cRud: READ ALL
router.post("/", [auth, validate(validateReturn)], async (req, res) => {
	const rental = await Rental.findOne({
		"customer._id": req.body.customerId,
		"movie._id": req.body.movieId,
	});
	if (!rental) return res.status(404).send("Rental not found.");

	if (rental.dateReturned)
		return res.status(400).send("The rental has already benn processes.");

	// these should go in a transaction.......................................
	rental.dateReturned = new Date();
	const rentalDays = moment().diff(rental.dateOut, "days");
	rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

	await rental.save();

	await Movie.update({ _id: rental.movie._id, $inc: { numberInStock: 1 } });

	res.status(200).send(rental);
});

// Validation - Used as  middleware by the module validateBody
function validateReturn(arg) {
	// // arg is the req.body in json
	const schema = Joi.object({
		customerId: Joi.objectId().required(),
		movieId: Joi.objectId().required(),
	});
	const result = schema.validate(arg);

	return result;
}

module.exports = router;
