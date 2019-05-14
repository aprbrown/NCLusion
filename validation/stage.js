/*
Input validation for stage creation

@author Andrew Brown
*/

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateStageInput(data) {
	let errors = {};

	data.beacon = !isEmpty(data.beacon) ? data.beacon : '';

	if (Validator.isEmpty(data.beacon)) {
		errors.beacon = 'Beacon field is required';
	}

	if (data.beacon.length !== 24) {
		errors.beacon = 'Beacon id must be 24 characters long';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
