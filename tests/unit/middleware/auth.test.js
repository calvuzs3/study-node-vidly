const { User } = require("../../../models/user");
const auth = require("../../../middleware/auth");
const mongoose = require("mongoose");

describe("middleware - auth test", () => {
	let token;
	it("should populate req.user with the payload of a valid JWT", async () => {
		const user = { _id: mongoose.Types.ObjectId(), isAdmin: true };
		const token = new User(user).generateAuthToken();

		const request = {
			header: jest.fn().mockReturnValue(token),
		};
		const response = {};
		const next = jest.fn();

		auth(request, response, next);

		expect(request.user).toMatchObject(user);
	});
});
