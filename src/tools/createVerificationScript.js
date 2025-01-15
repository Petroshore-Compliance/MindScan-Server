const prisma = require("../db.js");
const sendEmail = require("./nodemailer.js");
const fs = require("fs");
const path = require("path");

//recibe contactForm y comprueba si debe enviar el correo, esto solo sucede si ya existe un contactform con el mismo email
// si no debe enviar el correo, devuelve un objeto con la razón
const createVerificationScript = async (contactFormState) => {

console.log("contactFormState", contactFormState);

  const validStates = ["new", "inProgress", "accepted", "rejected"];

  console.log("validStates", validStates);
  console.log("includes", validStates.includes(contactFormState));
  if (!validStates.includes(contactFormState)) {
    return { reason: "Invalid state" };
  }

  const reasons = {
    new: "already new",
    inProgress: "already in progress",
    accepted: null, 
    rejected: null, 
  };
console.log("reasons", reasons);

console.log("return", reasons[contactFormState]);
  return reasons[contactFormState] ? { reason: reasons[contactFormState] } : undefined;
};
module.exports = { createVerificationScript };
