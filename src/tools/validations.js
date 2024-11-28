
const validateNumber = (value, fieldName) => {
  if (value === undefined || value === null || value === '') {
    return { error: `${fieldName} cannot be empty.` };
  }
  const numberValue = Number(value);
  if (isNaN(numberValue)) {
    return { error: `${fieldName} must be a number.` };
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
};
