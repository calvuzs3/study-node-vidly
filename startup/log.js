const config = require("config");
// const morgan = require("morgan");
const winston = require("winston");
const { format } = winston;
const { combine, label, json } = format;
// require("winston-mongodb");
require("express-async-errors");

module.exports = function (app) {
	// app.use(morgan("tiny"));
	// Enable exception handling when you create your logger.
	const logger = winston.createLogger({
		transports: [
			new winston.transports.File({
				filename: "vidly.log",
				format: winston.format.combine(winston.format.simple()),
				handleExceptions: false,
			}),
		],
		exceptionHandlers: [
			new winston.transports.File({
				filename: "uncaughtExceptions.log",
				format: winston.format.combine(winston.format.simple()),
				handleExceptions: true,
			}),
			new winston.transports.Console({
				format: winston.format.combine(
					winston.format.simple(),
					winston.format.colorize()
				),
				prettyPrint: true,
			}),
		],
		rejectionHandlers: [
			new winston.transports.File({
				filename: "rejectedPromises.log",
				format: winston.format.combine(winston.format.simple()),
				handleExceptions: false,
			}),
		],
		exitOnError: true,
	});

	// winston.add(
	// 	new winston.transports.File({
	// 		filename: "uncaughtExceptions.log",
	// 		handleExceptions: true,
	// 		),
	// 	})
	// );

	// process.on("unhandledRejection", (ex) => {
	// 	throw ex;
	// });

	// // Set the logs
	// winston.add(
	// 	new winston.transports.File({
	// 		filename: "",
	// 		handleExceptions: false,
	// 		format: winston.format.combine(winston.format.simple()),
	// 	})
	// );

	// winston.add(logger);
	// winston.add(
	// 	new winston.transports.MongoDB({ db: config.get("db"), level: "error" })
	// );
};
