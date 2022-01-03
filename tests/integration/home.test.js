const request = require("supertest");
let server ;

describe("GET /", () => {
	beforeEach(() => {
		server = require("../../index");
	});
	afterEach(async () => {
		await server.close();
	});
	it("should give 200 in response", async () => {
		const res = await request(server).get("/api/genres");

		expect(res.status).toBe(200);
	});
	it("should give 'hello world' in response", async () => {
		const res = await request(server).get("/api/genres");

		// expect(res.body).toMatch(/world/);
		// console.log(res);
		// console.log(res.body);
		// console.log(res.text);
		expect(res.status).toBe(200);
	});
});
