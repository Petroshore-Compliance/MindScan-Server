const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createContactFormMiddleware } = require("../middlewares/contactFormMiddlewares/createContactFormMiddleware.js");
const { getContactFormMiddleware } = require("../middlewares/contactFormMiddlewares/getContactFormMiddleware.js");
const { updateContactFormMiddleware } = require("../middlewares/contactFormMiddlewares/updateContactFormMiddleware.js");
const { deleteContactFormMiddleware } = require("../middlewares/contactFormMiddlewares/deleteContactFormMiddleware.js");

const { createContactFormHandler } = require("../handlers/contactFormHandlers/createContactFormHandler.js");
const { getContactFormHandler } = require("../handlers/contactFormHandlers/getContactFormHandler.js");
const { updateContactFormHandler } = require("../handlers/contactFormHandlers/updateContactFormHandler.js");
const { deleteContactFormHandler } = require("../handlers/contactFormHandlers/deleteContactFormHandler.js");

router.post("/create", createContactFormMiddleware, createContactFormHandler);
router.get("/get", authMiddleware, getContactFormMiddleware, getContactFormHandler);
router.patch("/update", authMiddleware, updateContactFormMiddleware, updateContactFormHandler);
router.delete("/delete", authMiddleware, deleteContactFormMiddleware, deleteContactFormHandler);

module.exports = router;