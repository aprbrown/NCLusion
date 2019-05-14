/*
Defines routes for user interaction.

@author Andrew Brown
*/

// Import node packages
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Initialise Router
const router = express.Router();
dotenv.config();

// Import User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Testing for users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users is Accessible' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({
		email: req.body.email
	}).then(user => {
		if (user) {
			errors.email = 'Email already exists';
			return res.status(400).json({ errors });
		} else {
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				question: req.body.question,
				answer: req.body.answer,
				password: req.body.password
			});

			bcryptjs.genSalt(10, (err, salt) => {
				bcryptjs.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

// @route   POST api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	// Find user by email
	User.findOne({ email }).then(user => {
		// Check for user
		if (!user) {
			errors.email = 'User not found';
			return res.status(404).json(errors);
		}

		// Check Password
		bcryptjs.compare(password, user.password).then(isMatch => {
			if (isMatch) {
				// User Matched
				const payload = {
					id: user.id,
					name: user.name,
					email: user.email
				};

				// Sign Token
				jwt.sign(
					payload,
					process.env.SECRET_OR_KEY,
					{
						// expires in 1 day
						expiresIn: 86400
					},
					(err, token) => {
						res.json({
							success: true,
							token: 'Bearer ' + token
						});
					}
				);
			} else {
				errors.password = 'Password incorrect';
				return res.status(400).json(errors);
			}
		});
	});
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email,
		question: req.user.question,
		answer: req.user.answer
	});
});

module.exports = router;
