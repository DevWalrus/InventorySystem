const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const middleWares = require('./middlewares')
const api = require('./api')

const project = require('./constants/project');

const app = express();

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: project.message,
    })
});

app.use('/api/v1', api);

app.use(middleWares.notFound);
app.use(middleWares.errorHandler);

module.exports = app;