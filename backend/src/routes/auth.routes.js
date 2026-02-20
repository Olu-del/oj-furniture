//Routes for authentication (register, signin, signout, get current user info)
const express = require('express');
const { signin, signout, register, me, requestPasswordReset, resetPassword} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


//Router for authentication-related endpoints
const router = express.Router();

//Routes for authentication
router.post('/register', register);
router.get('/me', authMiddleware, me);
router.post('/signin', signin);
router.post("/request-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post('/signout', signout);

// Export the router to be used in the main app
module.exports = router;



