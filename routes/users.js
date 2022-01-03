const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const express = require("express");
const router = express.Router();

// // cRud: READ ALL
// router.get("/", async (req, res) => {
// 	const result = await Movie.find();

// 	res.send(result);
// });

// cRud: READ ONE
router.get("/me", auth, async (req, res) => {
	// At this point we have a user in the req
	const user = await User.findById(req.user._id).select("-password");

	res.send(user);
});

// Crud - CREATE
router.post("/", async (req, res) => {
	const err = validate(req.body);
	if (err.error) return res.status(400).send(err.error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user)
		return res.status(400).send("User already registered with this email.");

	user = new User(_.pick(req.body, ["name", "email", "password"]));
	const salt = await bcrypt.genSalt(12);
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	// Generate token
	const token = user.generateAuthToken();

	// Pass the token in the HTTP Headers
	res.header("x-auth-token", token).send(
		_.pick(user, ["_id", "name", "email"])
	);
});

// // crUd - UPDATE
// router.put("/:id", async (req, res) => {
// 	const err = validate(req.body);
// 	if (err.error) return res.status(400).send(err.error.details[0].message);

// 	const movie = await Movie.findByIdAndUpdate(
// 		req.params.id,
// 		{
// 			title: req.body.title,
// 			genres: req.body.genres,
// 			numberInStock: req.body.numberInStock,
// 			dailyRentalRate: req.body.dailyRentalRate,
// 		},
// 		{ new: true }
// 	);

// 	if (!movie)
// 		return res.status(404).send("The given Customer ID was not found.");

// 	res.send(movie);
// });

// // cruD
// router.delete("/:id", async (req, res) => {
// 	const movie = await Movie.findByIdAndRemove(req.params.id);

// 	if (!movie)
// 		return res.status(404).send("The given Customer ID was not found.");

// 	res.send(movie);
// });

module.exports = router;
