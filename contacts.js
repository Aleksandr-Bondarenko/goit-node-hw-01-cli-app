require("colors");
const { nanoid } = require("nanoid");
const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("db/contacts.json");

console.log(`========== NODE.JS 34 ==========`);

async function listContacts() {
  try {
    return JSON.parse(await fs.readFile(contactsPath, "utf-8"));
  } catch (err) {
    console.log(err);
  }
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const foundContact = contacts.find((contact) => contact.id === contactId);

  foundContact
    ? console.table(foundContact)
    : console.log(`Contact with id ${contactId} not found.`.red);
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const filterContact = contacts.filter((contact) => contact.id !== contactId);

  try {
    await fs.writeFile(contactsPath, JSON.stringify(filterContact), "utf-8");
    if (contacts.length !== filterContact.length) {
      console.log(`Contact with id ${contactId} successfully deleted.`.green);
      console.table(await listContacts());
    } else {
      console.log(`Contact with id ${contactId} does not exist.`.red);
    }
  } catch (err) {
    console.log(err);
  }
}

async function addContact(name, email, phone) {
  const currentContactsList = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };

  const updateContacts = JSON.stringify(currentContactsList.concat(newContact));

  try {
    await fs.writeFile(contactsPath, updateContacts, "utf-8");
    console.log(
      `Contact with id ${newContact.id} has been successfully added.`.green
    );
    console.table(await listContacts());
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
