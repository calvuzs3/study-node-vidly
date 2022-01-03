const bcrypt = require("bcrypt");

const saltRounds = 12;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

async function run() {
	const salt = await bcrypt.genSalt(saltRounds);
	const hashed = await bcrypt.hash(myPlaintextPassword, salt);

	console.log(salt);
	console.log(hashed);
}
run();
// we see that the hash is included in the hashed password.
