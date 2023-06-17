'use strict';

const userFactory = require('./index');
const router = require('express').Router();


router.post('/', async (req, res) => {
    return await userFactory.saveContact(req, res)
        .then((resp) => { res.send({...resp }) })
        .catch((e) => { res.status(404).send({status:'error', msg: 'user not found'}) })
})

module.exports = router
