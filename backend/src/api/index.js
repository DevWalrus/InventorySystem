const express = require('express');

const project = require('../constants/project')
const states = require('./states/states.routes')
const countries = require('./countries/countries.routes')

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: project.message,
    })
})

router.use('/states', states);
router.use('/countries', countries);

module.exports = router;