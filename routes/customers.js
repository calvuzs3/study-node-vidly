const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// cRud: READ ALL
router.get("/", async (req, res) => {
	const result = await Customer.find();

	res.send(result);
});

// Crud - CREATE
router.post("/", async (req, res) => {
	const err = validate(req.body);
	if (err.error) return res.status(400).send(err.error.details[0].message);

	let customer = new Customer({
		name: req.body.name,
		phone: req.body.phone,
		isGold: req.body.isGold,
	});
	customer = await customer.save(customer);

	res.send(customer);
});

// cRud: READ ONE
router.get("/:id", async (req, res) => {
	const customer = await Customer.findById(req.params.id);

	if (!customer)
		return res.status(404).send("The given Customer ID was not found.");

	res.send(customer);
});

// crUd - UPDATE
router.put("/:id", async (req, res) => {
	const err = validate(req.body);
	if (err.error) return res.status(400).send(err.error.details[0].message);

	const customer = await Customer.findByIdAndUpdate(
		req.params.id,
		{ name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
		{ new: true }
	);

	if (!customer)
		return res.status(404).send("The given Customer ID was not found.");

	res.send(customer);
});

// cruD
router.delete("/:id", async (req, res) => {
	const customer = await Customer.findByIdAndRemove(req.params.id);

	if (!customer)
		return res.status(404).send("The given Customer ID was not found.");

	res.send(customer);
});

module.exports = router;
