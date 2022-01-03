const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
	const err = validate(req.body);
	if (err.error) return res.status(400).send(err.error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password.");

	// First let's validate the auth.password
	const isValidPassword = await bcrypt.compare(
		req.body.password,
		user.password
	);
	if (!isValidPassword)
		return res.status(400).send("Invalid email or password.");

	// Generate the token
	const token = user.generateAuthToken();

	// Add the tocken and
	// res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
	res.send(token);
});

// Validation for the purpose
function validate(arg) {
	const schema = Joi.object({
		email: Joi.string().min(3).max(255).required(),
		password: Joi.string().min(3).max(1024).required(),
	});
	return schema.validate(arg);
}

module.exports = router;
