/*
Input validation for trail creation

@author Andrew Brown
*/

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTrailInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';

	if (!Validator.isLength(data.name, { min: 2 })) {
		errors.name = 'Name must be more than 2 characters';
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
