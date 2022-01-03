const express = require("express");
const router = express.Router();

// cRud: READ ALL
router.post("/", async (req, res) => {
    res.status(401).send('Unauthenticated user.')

});

module.exports = router;