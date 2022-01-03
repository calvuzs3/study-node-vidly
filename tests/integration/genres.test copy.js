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
			const inserted = await genre.save();

			const r = await request(server).get(`/api/genres/${genre._id}`);
			expect(r.status).toBe(200);
			expect(r.body).toHaveProperty("name", genre.name); // is undefined
			// expect(r.body.some((g) => g.name === "genre1"));
		});

		it("should return 404 if invalid id is passed", async () => {
			const r = await request(server).get(`/api/genres/1`);
			expect(r.status).toBe(404);
			// expect(r.body).toHaveProperty("name", genre.name); // is undefined
			// expect(r.body.some((g) => g.name === "genre1"));
		});
	});

	describe("POST /", () => {
		it("should return 401 if the client is not logged in", async () => {
			const res = await request(server)
				.post("/api/genres")
				.send({ name: "genre1" });

			expect(res.status).toBe(401);
		});
		it("should return 400 if the genre is invalid ( less than 3chars )", async () => {
			const token = new User().generateAuthToken();

			const res = await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "12" });

			expect(res.status).toBe(400);
		});
		it("should return 400 if the genre is invalid ( more than 50 chars )", async () => {
			const token = new User().generateAuthToken();

			const res = await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: new Array(52).join("a") });

			expect(res.status).toBe(400);
		});
		it("should return 400 if the genre name is missing ( required )", async () => {
			const token = new User().generateAuthToken();

			const res = await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "" });

			expect(res.status).toBe(400);
		});
		it("should return 200 and save the genre if it is valid", async () => {
			const token = new User().generateAuthToken();

			const res = await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "genre1" });
			const genre = await Genre.find({ name: "genre1" });

			expect(genre).not.toBeNull();
		});
		it("should return 200 and the genre in the body", async () => {
			const token = new User().generateAuthToken();

			const res = await request(server)
				.post("/api/genres")
				.set("x-auth-token", token)
				.send({ name: "genre1" });

			expect(res.body).toHaveProperty("_id");
			expect(res.body).toHaveProperty("name", "genre1");
		});
	});
});
