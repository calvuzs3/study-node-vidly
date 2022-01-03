const moment = require("moment");
const mongoose = require("mongoose");
const request = require("supertest");
const { Rental } = require("../../models/rental");
const { User } = require("../../models/user");
const { Movie } = require("../../models/movie");

/* We implement the tests for new upcoming endpoint /api/returns
 *
 * POST /api/returns {customerId, movieId}
 * 401 unouthorized - without token
 * 403 forbidden - with token but not an admin
 * 400 bad request - customerId not provided
 * 400 bad request - movieId not provided
 * 404 no rental found
 * 400 bad request - rental already processed
 *
 * 200 ok
 * 200 set the return date
 * 200 calculate the rental fee
 * 200 increase the stock
 * 200 return the rental
 */

describe("/api/returns", () => {
	let server;
	let customerId;
	let movieId;
	let rental;
	let token;
	let movie;

	const exec = function () {
		return request(server)
			.post("/api/returns")
			.set("x-auth-token", token)
			.send({ customerId, movieId });
	};

	beforeEach(async () => {
		server = require("../../index");

		customerId = mongoose.Types.ObjectId();
		movieId = mongoose.Types.ObjectId();
		token = new User().generateAuthToken();

		// Create a movie
		movie = new Movie({
			_id: movieId,
			title: "12345",
			numberInStock: 0,
			dailyRentalRate: 2,
		});
		await movie.save();

		// Create a rental for test psurposes
		rental = new Rental({
			customer: {
				_id: customerId,
				name: "12345",
				phone: "12345",
			},
			movie: {
				_id: movieId,
				title: "12345",
				dailyRentalRate: 2,
			},
		});
		await rental.save();
	});

	afterEach(async () => {
		await Rental.remove({});
		await Movie.remove({});
		await server.close();
	});

	describe("POST /", () => {
		it("should work!", async () => {
			const res = await Rental.findById(rental._id);
			expect(res.status).not.toBeNull();
		});

		it("should return 401 if client is not logged in", async () => {
			token = "";

			const res = await exec();

			expect(res.status).toBe(401);
		});

		it("should return 400 if customerId is not provided", async () => {
			customerId = "";

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should return 400 if movieId is not provided", async () => {
			movieId = "";

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should return 404 if no rental has been found", async () => {
			customerId = mongoose.Types.ObjectId();
			movieId = mongoose.Types.ObjectId();

			const res = await exec();

			expect(res.status).toBe(404);
		});

		it("should return 400 if the rental has already been processed", async () => {
			rental.dateReturned = Date.now();
			await rental.save();

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should set the dateReturned if input is valid", async () => {
			const res = await exec();

			const rentalInDb = await Rental.findById(rental._id);
			const diff = rentalInDb.dateReturned - new Date();
			expect(diff).toBeLessThan(10 * 1000);
			// expect(rentalInDb.dateReturned).toBeDefined();
		});

		it("should calculate the rentalfee if input is valid", async () => {
			rental.dateOut = moment().add(-7, "days").toDate();
			await rental.save();

			const res = await exec();

			const rentalInDb = await Rental.findById(rental._id);

			expect(rentalInDb.rentalFee).toBe(14);
		});

		it("should return 200 and the numberInStock should be increased by 1", async () => {
			await movie.save();

			const res = await exec();

			movie = await Movie.findById(rental.movie._id);

			expect(movie.numberInStock).toBe(1);
		});

		it("should return 200 if the request is valid", async () => {
			const res = await exec();

			expect(res.status).toBe(200);
		});
		it("should return the rental in the body if the request is valid", async () => {
			const res = await exec();

			const rentalInDb = await Rental.findById(rental._id);
			// expect(res.body).toHaveProperty('dateOut');
			// expect(res.body).toHaveProperty('dateOut');
			// expect(res.body).toHaveProperty('dateOut');
			// expect(res.body).toHaveProperty('dateOut');
			// expect(res.body).toHaveProperty('dateOut');
			expect(Object.keys(res.body)).toEqual(
				expect.arrayContaining([
					"dateOut",
					"dateReturned",
					"rentalFee",
					"customer",
					"movie",
				])
			);
		});
	});
});
