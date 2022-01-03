const express = require("express");
// const winston = require("winston");
const app = express();

// Include the startup routes..
require("./startup/config")();
// require("./startup/log")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();

// Server in ascolto
const port = process.env.VIDLY_PORT || 3000;
const server = app.listen(port, function () {
	// console.log(`Vidly server listening on port: ${port}`);
});

module.exports = server;
