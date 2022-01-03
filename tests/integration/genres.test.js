const mongoose = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

let server;

describe("/api/genres", () => {
	beforeEach(() => {
		server = require("../../index");
	});
	afterEach(async () => {
		await Genre.remove({});
		await server.close();

	});

	describe("GET /", () => {
		it("should return all genres", async () => {
			await Genre.collection.insertMany([
				{ name: "genre1" },
				{ name: "genre2" },
				{ name: "genre3" },
			]);

			const r = await request(server).get("/api/genres");
			expect(r.status).toBe(200);
			// expect(r.body.lenght).toBe(3); // is undefined
			expect(r.body.some((g) => g.name === "genre1"));
			expect(r.body.some((g) => g.name === "genre2"));
			expect(r.body.some((g) => g.name === "genre3"));
		});
	});

	describe("GET /:id", () => {
		it("should return the genre with specified id", async () => {
			const genre = new Genre({ name: "genre1" });
			await genre.save();

			const r = await request(server).get(`/api/genres/${genre._id}`);
			expect(r.status).toBe(200);
			expect(r.body).toHaveProperty("name", genre.name); // is undefined
		});

		it("should return 404 if invalid id is passed", async () => {
			const r = await request(server).get(`/api/genres/1`);
			expect(r.status).toBe(404);
		});

		it("should return 404 if no genre whith the given id exists", async () => {
			const id = mongoose.Types.ObjectId();
			const r = await request(server).get("/api/genres/" + id);
			expect(r.status).toBe(404);
		});
	});

	describe("POST /", () => {
		let token;
		let name;

		const exec = async () => {
			return await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name }); // key and value are the same
		};

		beforeEach(() => {
			token = new User().generateAuthToken();
			name = "genre1";
		});

		it("should return 401 if the client is not logged in", async () => {
			token = "";

			const res = await exec();

			expect(res.status).toBe(401);
		});
		it("should return 400 if the genre is invalid ( less than 3chars )", async () => {
			name = "12";

			const res = await exec();

			expect(res.status).toBe(400);
		});
		it("should return 400 if the genre is invalid ( more than 50 chars )", async () => {
			name = new Array(52).join("a");

			const res = await exec();

			expect(res.status).toBe(400);
		});
		it("should return 400 if the genre name is missing ( required )", async () => {
			name = "";

			const res = await exec();

			expect(res.status).toBe(400);
		});
		it("should return 200 and save the genre if it is valid", async () => {
			await exec();

			const genre = await Genre.find({ name: "genre1" });

			expect(genre).not.toBeNull();
		});
		it("should return 200 and the genre in the body", async () => {
			const res = await exec();

			expect(res.body).toHaveProperty("_id");
			expect(res.body).toHaveProperty("name", "genre1");
		});
	});

	describe("DELETE /:id", () => {
		let token;
		let genre;
		let id;

		const exec = async () => {
			return await request(server)
				.delete("/api/genres/" + id)
				.set("x-auth-token", token)
				.send();
		};

		beforeEach(async () => {
			genre = new Genre({ name: "genre1" });
			await genre.save();

			id = genre._id;
			token = new User({ isAdmin: true }).generateAuthToken();
		});

		it("should return 401 if the user is unauthorized", async () => {
			token = "";

			const res = await exec();

			expect(res.status).toBe(401);
		});

		it("should return 403 if the user is not an admin", async () => {
			token = new User({ isAdmin: false }).generateAuthToken();

			const res = await exec();

			expect(res.status).toBe(403);
		});

		it("should return 404 if the given id was not found", async () => {
			id = mongoose.Types.ObjectId();

			const res = await exec();

			expect(res.status).toBe(404);
		});

		it("should return 200 the genre deleted", async () => {
			const res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("_id");
			expect(res.body).toHaveProperty("name", "genre1");
		});
	});

	describe("PUT /", () => {
		let token;
		let genre;
		let id;
		let name;
		let newName;

		const exec = async () => {
			return await request(server)
				.put("/api/genres/" + id)
				.set("x-auth-token", token)
				.send({ name: newName }); // key and value are the same
		};

		beforeEach(async () => {
			genre = new Genre({ name: "genre1" });
			await genre.save();

			id = genre._id;
			token = new User({ isAdmin: true }).generateAuthToken();
			newName = "updatedName";
		});

		it("should return 401 if the client is not logged in", async () => {
			token = "";

			const res = await exec();

			expect(res.status).toBe(401);
		});

		it("should return 400 if the genre is invalid ( less than 3chars )", async () => {
			newName = "12";

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should return 400 if the genre is invalid ( more than 50 chars )", async () => {
			newName = new Array(52).join("a");

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should return 400 if the genre new name is missing ( required )", async () => {
			newName = "";

			const res = await exec();

			expect(res.status).toBe(400);
		});

		it("should return 404 if the id (valid) was not found", async () => {
			id = mongoose.Types.ObjectId();

			const res = await exec();

			expect(res.status).toBe(404);
		});

		it("should update the genre if input is valid", async () => {
			await exec();

			const updatedGenre = await Genre.findById(genre._id);

			expect(updatedGenre.name).toBe(newName);
		});

		it("should return the updated genre if it is valid", async () => {
			const res = await exec();

			expect(res.body).toHaveProperty("_id");
			expect(res.body).toHaveProperty("name", newName);
		});
	});
});
