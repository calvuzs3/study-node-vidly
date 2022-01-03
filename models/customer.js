const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlenght: 3,
		maxlenght: 50,
	},
	phone: {
		type: String,
		required: true,
		minlenght: 5,
		maxlenght: 50,
	},
	isGold: {
		type: Boolean,
		default: false,
	},
});
// Istance ..
const Customer = new mongoose.model("Customer", customerSchema);

// Validation
function validateCustomer(arg) {
	// // arg is the req.body in json
	const schema = Joi.object({
		name: Joi.string().min(3).max(50).required(),
		phone: Joi.string().min(3).max(50).required(),
	});
	const result = schema.validate({ name: arg.name, phone: arg.phone });

	if (result.error) {
		console.log("*validateCustomer: ", result.error.details[0].message);
	}
	return result;
}

exports.Customer = Customer;
exports.validate = validateCustomer;
