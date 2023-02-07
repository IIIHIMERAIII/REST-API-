const express = require('express');
const Joi = require('joi');
const router = express.Router();

const contacts = require('../../models/contacts');

const schema = Joi.object({
  name: Joi.string()
    .pattern(/^[a-z,A-Z,0-9, ,-]+$/)
    .min(2)
    .max(20)
    .required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "ru", "rus"] },
  }),
  phone: Joi.string()
    .min(6)
    .max(12)
    .pattern(/^[0-9, ,(),+,-]+$/),
});

router.get('/', async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (err){
    next(err);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const result = await contacts.getContactById(req.params.contactId);
    if (result) {
      res.json(result);
      next();
      return;
    }
    res.json({ message: "Not found", status: "404" });
    next();
  } catch (err) {
    res.json(`${err}`);
    next();
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const validetionData = schema.validate(req.body);
 if (validetionData.error) {
      res.status(400).json({ message: "Missing required name field." });
    } else {
      const newContact = await contacts.addContact({ name, email, phone });
      res.status(201).json(newContact);
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/:contactId', async (req, res, next) => {
    try {
    const result = await contacts.removeContact(req.params.contactId);
    res.json(result);
    next();
  } catch (err) {
    res.json(`${err}`);
    next();
  }
});

router.put('/:contactId', async (req, res, next) => {
  try {
    const validetionData = schema.validate(req.body);
      if (validetionData.error) {
      res.status(400).json({ message: "Missing required name field." });
      return;
    } else {
      const updatedContact = await contacts.updateContact(
        `${req.params.contactId}`,
        req.body
      );
      if (!updatedContact) {
        res.status(404).json({ message: "Not found" });
      } else {
        res.json(updatedContact);
      }
    }
  }  catch (err) {
    next(err);
  }
});

module.exports = router
