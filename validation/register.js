/*
Input validation for user registration

@author Andrew Brown
*/

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
	let errors = {};

	data.name = !isEmpty(data.name) ? data.name : '';
	data.email = !isEmpty(data.email) ? data.email : '';
	data.password = !isEmpty(data.password) ? data.password : '';
	data.password2 = !isEmpty(data.password2) ? data.password2 : '';
	data.question = !isEmpty(data.question) ? data.question : '';
	data.answer = !isEmpty(data.answer) ? data.answer : '';

	if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = 'Name must be between 2 and 30 characters';
	}

	if (Validator.isEmpty(data.name)) {
		errors.name = 'Name field is required';
	}

	if (Validator.isEmpty(data.email)) {
		errors.email = 'Email field is required';
	}

	if (!Validator.isEmail(data.email)) {
		errors.email = 'Not a valid email address';
	}

	if (!Validator.contains(data.email, '@ncl.ac.uk')) {
		errors.email = 'Must be an @ncl.ac.uk email address';
	}

	if (Validator.isEmpty(data.password)) {
		errors.password = 'Password field is required';
	}

	if (!Validator.isLength(data.password, { min: 8 })) {
		errors.password = 'Password must be at least 8 characters';
	}

	if (Validator.isEmpty(data.password2)) {
		errors.password2 = 'Confirm password field is required';
	}

	if (!Validator.equals(data.password, data.password2)) {
		errors.password2 = 'Passwords must match';
	}

	if (Validator.isEmpty(data.question)) {
		errors.question = 'Question field is required';
	}

	if (Validator.isEmpty(data.answer)) {
		errors.answer = 'Answer field is required';
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
