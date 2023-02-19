const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { mongooseHandleError } = require('../helpers');

const contactShema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { versionKey: false, timestamps: true });

contactShema.post("save", mongooseHandleError);


const addSchema = Joi.object({
  name: Joi.string().required()
    .pattern(/^[a-z,A-Z,0-9, ,-]+$/)
    .min(2)
    .max(20),
  email: Joi.string().required().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ru", "rus"] },
  }),
  phone: Joi.string().required()
    .min(6)
    .max(20)
        .pattern(/^[0-9, ,(),+,-]+$/),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = {
    addSchema,
    updateFavoriteSchema,
};

const Contact = model('contact', contactShema);

module.exports = {
    Contact,
    schemas,
};