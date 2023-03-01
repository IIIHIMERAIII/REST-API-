const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');


const { User } = require('../models/user')

const { HttpError, ctrlWrapper } = require('../helpers/');

const { SECRET_KEY } = process.env;

const avatarDir = path.join(__dirname, '../', 'public', 'avatars');

const signup = async(req, res) => {
    const { email, password} = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, `User by Email: ${email} is already exist`)
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    
    const results = await User.create({ ...req.body, password: hashPassword, avatarURL });

    res.json(
        `Successful create user by Email: ${results.email}`
    )
};

const signin = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, 'Email or password invalid');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, 'Email or password invalid');
    }
    
    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
    })
};

const getCurrent = async(req, res) => {
    const { email } = req.user;

    res.json({
        email,
    })
};

const logout = async(req, res) => {
    await User.findByIdAndUpdate(req.user._id, { token: "" });

    res.json({
        message: 'Logout success'
    })
};

const updateAvatar = async (req, res) => {
    if (!req.file) {
        throw HttpError(400, "Avatar must be exist");
    }
    const { path: tempUpload, originalname } = req.file;
    const { _id } = req.user;
    const extension = originalname.split(".").pop();
    const filename = `${_id}_avatar.${extension}`;
    const resultsUpload = path.join(avatarDir, filename);
    await fs.rename(tempUpload, resultsUpload);
    const avatarURL = path.join('avatars', filename);
    await User.findByIdAndUpdate(_id , { avatarURL});

    res.json({
        avatarURL,
    })
}; 


module.exports = {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar),
}
 