const express = require('express');

const queries = require('./states.queries');

const router = express.Router();

router.get('/', (req, res) => {
    const states = await queries.find();
    res.json(states);
});

module.exports = router;