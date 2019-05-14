/*
Input validation for beacon creation

@author Andrew Brown
*/

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateBeaconInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.longitude = !isEmpty(data.longitude) ? data.longitude : '';
	data.latitude = !isEmpty(data.latitude) ? data.latitude : '';

	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}

	if (!Validator.isDecimal(data.latitude)) {
		errors.latitude = 'Latitude must be in decimal format';
	}

	if (data.latitude < -90 || data.latitude > 90) {
		errors.latitude = 'Latitude must be between -90 and 90';
	}

	if (!Validator.isDecimal(data.longitude)) {
		errors.longitude = 'Longitude must be in decimal format';
	}

	if (data.longitude < -180 || data.longitude > 180) {
		errors.longitude = 'Longitude must be between -180 and 180';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
