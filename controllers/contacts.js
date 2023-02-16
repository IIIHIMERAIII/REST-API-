const { Contact } = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../helpers/');

const listContacts = async (req, res) => {
    const result = await Contact.find({}, "name email phone favorites");
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id:contactId });
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`)
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { name, email, phone } = req.body;
      const newContact = await Contact.create({ name, email, phone });
      res.status(201).json(newContact);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404,`Contact with id ${contactId} not found` )
    }
    res.json({
        message: "Delete success"
    });
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true});
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`)
    }
    res.json(result);
};

const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new:true});
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`)
    }
    else if (!req.body) {
        throw HttpError(400, `Missing field favorite`)
    }
    res.json(result);
};

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    removeContact:ctrlWrapper(removeContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact)
}