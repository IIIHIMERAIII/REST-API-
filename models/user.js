const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { mongooseHandleError } = require('../helpers');

const emailRegexp = (
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const userSchema = new Schema({
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    match: emailRegexp,
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: String,
  default:""
}, { versionKey: false, timestamps: true });

userSchema.post("save", mongooseHandleError); 

const signupSchema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string().pattern(emailRegexp).required(),
});

const signinSchema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string().pattern(emailRegexp).required(),
});

const schemas = {
    signupSchema,
    signinSchema
};

const User = model('user', userSchema);

module.exports = {
    User,
    schemas
}