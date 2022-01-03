const mongoose = require("mongoose");
const request = require("supertest");
const {Rental} = require('../../models/rental')
// const { Genre } = require("../../models/genre");
// const { User } = require("../../models/user");

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
	
    beforeEach(async () => {
		server = require("../../index");

        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        // Create a rental for test psurposes
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            },

        })
        await rental.save();
	});

	afterEach(async () => {
		await Rental.remove({});
		await server.close();
	});

	describe("POST /", () => {
        
		it("should work!", async () => {
			const res = await Rental.findById( rental._id );
			expect(res.status).not.toBeNull();
        })
    
        
        it("should return 401 if client is not logged in", async () => {
            const res = await request(server )
            .post('/api/returns')
            .send({customerId, movieId });
            
            expect(res.status).toBe(401);
        });

    });

});