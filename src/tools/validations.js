

const regexEmail = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
const regexName = /^[A-Za-zÀ-ÿ\s]+$/;
const regexPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
const regexPhone = /^\+\d{7,19}$/;

const validateNumber = (value, fieldName, regex) => {
  if (value === undefined || value === null || value === '') {
    return { error: `${fieldName} cannot be empty.` };
  }
  
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return { error: `${fieldName} must be a number.` };
  }
  
  // If a regex is provided, validate against it
  if (regex && !regex.test(value)) {
    return { error: `Invalid ${fieldName.toLowerCase()} format.` };
  }
  
  return { value: numberValue };
};

const validateString = (value, fieldName, regex) => {
  if (value === undefined || value === null || value === '') {
    return { error: `${fieldName} cannot be empty.` };
  }
  if (typeof value !== 'string') {
    return { error: `${fieldName} must be a string.` };
  }
  value = value.trim();
  if (regex && !regex.test(value)) {
    return { error: `Invalid ${fieldName.toLowerCase()} format.` };
  }
  if(fieldName==="Role"){
    if(value !== 'employee' && value !== 'manager' && value!== 'admin'){
      return { error: 'Role not recognised'}
    }
  }
  return { value };
};

const validateBoolean = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { error: `${fieldName} cannot be empty.` };
  }
  if (typeof value !== 'boolean') {
    return { error: `${fieldName} must be a boolean.` };
  }
  return { value };
};

const validateArray = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { error: `${fieldName} cannot be empty.` };
  }
  if (!Array.isArray(value)) {
    return { error: `${fieldName} must be an array.` };
  }
  if (value.length === 0) {
    return { error: `${fieldName} cannot be empty.` };
  }
  return { value };
};

const validateObject = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { error: `${fieldName} cannot be empty.` };
  }
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return { error: `${fieldName} must be an object.` };
  }
  if (Object.keys(value).length === 0) {
    return { error: `${fieldName} cannot be empty.` };
  }
  return { value };
};

module.exports = {
  validateNumber,
  validateString,
  validateBoolean,
  validateArray,
  validateObject,
  regexEmail,
  regexName,
  regexPass,
  regexPhone
};
