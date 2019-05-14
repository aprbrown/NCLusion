/*
Input validation for team creation

@author Andrew Brown
*/

const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTeamInput(data) {
	let errors = {};

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
