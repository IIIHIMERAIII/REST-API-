const express = require('express');

const ctrl = require('../../controllers/auth');
const { validateBody, authenticate} = require('../../middlewars');
const { schemas } = require('../../models/user');

const router = express.Router();



router.post('/signup', validateBody(schemas.signupSchema), ctrl.signup);

router.post('/signin', validateBody(schemas.signinSchema), ctrl.signin);

router.get('/current', authenticate, ctrl.getCurrent);

router.post('/logout', authenticate, ctrl.logout);

module.exports = router;