const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
// const mongoose = require("mongoose");
const express = require("express");
// const Fawn = require("fawn");
const router = express.Router();

// Fawn.init(mongoose);

// cRud: READ ALL
router.get("/", async (req, res) => {
	const result = await Rental.find();

	res.send(result);
});

// Crud - CREATE
router.post("/", async (req, res) => {
	const err = validate(req.body);
	if (err.error) return res.status(400).send(err.error.details[0].message);

	const customer = await Customer.findById(req.body.customerId);
	if (!customer) return res.status(400).send("Invalid Customer.");
	console.log("OK Customer.", customer.name);

	const movie = await Movie.findById(req.body.movieId);
	if (!movie) return res.status(400).send("Invalid Movie.");
	console.log("OK Movie.", movie.title);

	if (movie.numberInStock === 0)
		return res.status(400).send("Movie not in stock.");
	console.log("OK numberInStock.", movie.numberInStock);

	let rental = new Rental({
		customer: {
			_id: customer._id, // i forgot this one :(
			name: customer.name,
			phone: customer.phone,
			isGold: customer.isGold,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
	});

	// new Fawn.Task()
	// 	.save("rentals", rental)
	// 	.update(
	// 		"movies",
	// 		{ _id: movie._id },
	// 		{
	// 			$inc: {
	// 				numberInStock: -1,
	// 			},
	// 		}
	// 	)
	// 	.run()
	// 	.then(res.send(rental))
	// 	.catch((err) => {
	// 		res.status(500).send("Something failed..", ex.message);
	// 	});

	rental = await rental.save();

	// For something that reasamble the transactions
	// we need a module: two phase commit
	// npm i fawn
	movie.numberInStock--;
	movie.save();

	res.send(rental);
});

// // cRud: READ ONE
// router.get("/:id", async (req, res) => {
// 	const genre = await Genre.findById(req.params.id);

// 	if (!genre)
// 		return res.status(404).send("The given genre ID was not found.");

// 	res.send(genre);
// });

// // crUd - UPDATE
// router.put("/:id", async (req, res) => {
// 	const err = validate(req.body);
// 	if (err.error) return res.status(400).send(err.error.details[0].message);

// 	const genre = await Genre.findByIdAndUpdate(
// 		req.params.id,
// 		{ name: req.body.name },
// 		{ new: true }
// 	);

// 	if (!genre)
// 		return res.status(404).send("The given genre ID was not found.");

// 	res.send(genre);
// });

// // cruD
// router.delete("/:id", async (req, res) => {
// 	const genre = await Genre.findByIdAndRemove(req.params.id);

// 	if (!genre)
// 		return res.status(404).send("The given genre ID was not found.");

// 	res.send(genre);
// });

module.exports = router;
