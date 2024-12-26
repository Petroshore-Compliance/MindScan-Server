const { Router } = require("express");
const router = Router();

const { authMiddleware } = require("../middlewares/authMiddleware.js");
const { createFormMiddleware } = require("../middlewares/formMiddlewares/createFormMiddleware.js");
const { getFormMiddleware } = require("../middlewares/formMiddlewares/getFormMiddleware.js");
const { updateFormMiddleware } = require("../middlewares/formMiddlewares/updateFormMiddleware.js");
const { deleteFormMiddleware } = require("../middlewares/formMiddlewares/deleteFormMiddleware.js");

const { createFormHandler } = require("../handlers/formHandlers/createFormHandler.js");
const { getFormHandler } = require("../handlers/formHandlers/getFormHandler.js");
const { updateFormHandler } = require("../handlers/formHandlers/updateFormHandler.js");
const { deleteFormHandler } = require("../handlers/formHandlers/deleteFormHandler.js");

router.post("/create-form", authMiddleware, createFormMiddleware, createFormHandler);
router.get("/get-form", authMiddleware, getFormMiddleware, getFormHandler);
router.patch("/update-form", authMiddleware, updateFormMiddleware, updateFormHandler);
router.delete("/delete-form", authMiddleware, deleteFormMiddleware, deleteFormHandler);


module.exports = router;