const express = require('express');

const ctrl = require('../../controllers/auth');
const { validateBody, authenticate, upload} = require('../../middlewars');
const { schemas } = require('../../models/user');

const router = express.Router();



router.post('/signup', validateBody(schemas.signupSchema), ctrl.signup);

router.post('/signin', validateBody(schemas.signinSchema), ctrl.signin);

router.get('/current', authenticate, ctrl.getCurrent);

router.post('/logout', authenticate, ctrl.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.updateAvatar);

module.exports = router;