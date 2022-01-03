const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");

// Istance ..
const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlenght: 3,
		maxlenght: 50,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		minlenght: 3,
		maxlenght: 255,
	},
	password: {
		type: String,
		required: true,
		min: 3,
		max: 1024,
	},
	isAdmin: {
		type: Boolean,
		default: false,
	},
});

// Generate the token
userSchema.methods.generateAuthToken = function () {
	return (token = jwt.sign(
		{ _id: this._id, isAdmin: this.isAdmin },
		config.get("jwtPrivateKey")
	));
};

// Instance
const User = new mongoose.model("User", userSchema);

// Validation
function validateUser(arg) {
	// // arg is the req.body in json
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required(),
		email: Joi.string().min(3).max(255).required(),
		password: Joi.string().min(3).max(1024).required(),
		isAdmin: Joi.boolean(),
	});
	const result = schema.validate(arg);

	return result;
}

exports.User = User;
exports.validate = validateUser;
