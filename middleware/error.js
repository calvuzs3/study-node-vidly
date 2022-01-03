// const winston = require("winston");

// Catching exceptions
module.exports = function (err, req, res, next) {
	// Log the exception
	// winston.error(err.message, err);
	// Send '500 Internal server error' back
	res.status(500).send("Samething faild with message: " + err.message);
};
