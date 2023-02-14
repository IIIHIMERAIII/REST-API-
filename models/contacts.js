const fs = require('fs/promises')
const path = require('path')
const contactsPath = path.join(__dirname, './contacts.json');
const { nanoid } = require('nanoid');


const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await listContacts();
    const results = data.find((item) => item.id === contactId);
    return results || null;
  } catch(err) {
    console.log(err);
  }
};

const removeContact = async (contactId) => {
    const data = await listContacts();
    const index = data.findIndex(item => item.id == contactId);
    if (index === -1) {
        return { message: "Not found" };
    }
    const [results] = data.splice(index, 1)  
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return { message: "contact deleted" };
}; 


const addContact = async (body) => {
  try {
    const data = await listContacts();
    const newContact = {
      ...body,
      id: nanoid(),
    };

    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  const data = await listContacts();
  const contact = data.find(item => item.id == contactId);
  if (!contact) {
    return null;
  }
  const newList = data.map(item => {
    if (item.id == contactId) {
      item = { ...item, ...body };
      return item;
    }
    return item;
  });
  await fs.writeFile(contactsPath, JSON.stringify(newList, null, 2));

  const newContact = newList.find(item => item.id == contactId);
  return newContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
