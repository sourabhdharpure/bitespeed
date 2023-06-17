'use strict';

const router = (module.exports = require('express').Router());

const userRoute = require(`./user/router`)

router.use(`/identify`, userRoute);







