const { Contact } = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../helpers/');

const listContacts = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "name email phone favorites", {skip, limit}).populate("owner", "email");
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.body;
    const result = await Contact.findOne({ _id:contactId });
    if (!result) {
        throw HttpError(404, `Contact with id ${contactId} not found`)
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { name, email, phone } = req.body;
      const newContact = await Contact.create({ name, email, phone, owner});
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