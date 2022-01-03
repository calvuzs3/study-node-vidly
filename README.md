# Add Testing to the vidly project

Let's test the generateAuthToken() in the User.js
we create a user with the function of -> mongoose.Types.ObjectId()
then we supply this info to the fn() and se if it's verified by the function
jwt.verify()

# Integration Testing

we test our function with a real db. In other word we create an alternative db
where to store data which are used by testing functions.

let'see how:

1. populate the db
2. HTTP request from client to server
3. Assert. We wait a response..
   => so, if we test a POST method to create an object,
   we shall verify the data is on the db, there for real.

-   let's go
    npm install supertest

now app.listen() returns a Server obj.
so in the index we export the server obj we have

in the test we call the server, but we have to close it in the end of test
otherwise the tests will be repeated..

beforeEach( ()=>{ let server= require('server') })

# Results

it("should return 404 if invalid id is passed", async () => {
const r = await request(server).get(`/api/genres/1`);
expect(r.status).toBe(404);
// expect(r.body).toHaveProperty("name", genre.name); // is undefined
// expect(r.body.some((g) => g.name === "genre1"));
});

        After this check we confirmed that the response of our function
        was not what it should have been.
        And we discovered that we miss the check of id in the body.req

        After this we can perform a refactoring with confidence... moving the check in +
        the middelwares - validateObjectId.js

-   We refactoring the code... just add a cpoy of the original file

# JEST -> tells us

how many of your code is covered by tests??
flag: --coverage

# Integration tests

made many...
with the module supertest
