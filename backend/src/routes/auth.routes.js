const express = require('express');
const { signin, signout, register } = require('../controllers/auth.controller');


const router = express.Router();

router.post('/register', register);
router.post('/signin', signin);
router.post('/signout', signout);

module.exports = router;



