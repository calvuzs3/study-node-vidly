// A wrap function which transforms our check function
// in a piece of middlewarer...
//now we check by the validator supplied
//
module.exports = (validator) => {
	return function (req, res, next) {
		// Validate the body
		const err = validator(req.body);

		// Bad request
		if (err.error) return res.status(400).send(err.error.details[0].message);

		// Follow the chain, everything is OK
		next();
	};
};
