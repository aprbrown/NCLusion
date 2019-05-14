/*
Defines routes for trail interacton

@author Andrew Brown
*/

// Import node modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Import trail model
const Trail = require('../../models/Trail');
const Team = require('../../models/Team');

// Load validation files
const validateTrailInput = require('../../validation/trail');
const validateStageInput = require('../../validation/stage');

const router = express.Router();

// @route   GET api/trails/test
// @desc    Testing for trails route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Trails is Accessible' }));

// @route   GET api/trails/all
// @desc    Get all trails
// @access  Public
router.get('/all', (req, res) => {
	const errors = {};
	Trail.find()
		.then(trails => {
			if (!trails) {
				errors.notrail = 'There are no trails';
				return res.status(404).json(errors);
			}
			res.json(trails);
		})
		.catch(err => res.status(404).json({ trail: 'There are no trails' }));
});

// @route   GET api/trails/my-trails/:user_id
// @desc    Get trails user is registered to
// @access  Public
router.get('/my-trails/:user_id', (req, res) => {
	const errors = {};
	Trail.find({ registeredUsers: { $elemMatch: { user: req.params.user_id } } })
		.then(trails => {
			if (!trails) {
				errors.notrail = 'There are no trails';
				return res.status(404).json(errors);
			}
			res.json(trails);
		})
		.catch(err => res.status(404).json({ trail: 'There are no trails' }));
});

// @route   GET api/trails/:trail_id
// @desc    Get trail by trail ID
// @access  Public
router.get('/:id', (req, res) => {
	const errors = {};
	Trail.findById(req.params.id)
		.then(trail => res.json(trail))
		.catch(err => res.status(404).json({ trail: 'Trail does not exist' }));
});

// @route   POST api/trails/create
// @desc    Create a new trail
// @access  Public
router.post('/create', (req, res) => {
	const { errors, isValid } = validateTrailInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	Trail.findOne({
		name: req.body.name
	}).then(trail => {
		if (trail) {
			errors.name = 'Trail name already exists';
			return res.status(400).json({ errors });
		} else {
			const newTrail = new Trail({
				name: req.body.name
			});

			newTrail.save().then(trail => res.json(trail));
		}
	});
});

// @route   POST api/trails/add-stage/:id
// @desc    Add a stage to a trail
// @access  Public
router.post('/add-stage/:id', (req, res) => {
	const { errors, isValid } = validateStageInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	Trail.findById(req.params.id)
		.then(trail => {
			const newStage = {
				beacon: req.body.beacon
			};

			trail.stages.push(newStage);

			trail.save().then(trail => res.json(trail));
		})
		.catch(err => res.status(404).json({ trailnotfound: 'No Trail Found' }));
});

// @route   POST api/trails/register/:trail_id
// @desc    Register a user to a trail
// @access  Private
router.post('/register/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.findOne({ user: req.user.id }).then(user => {
		Trail.findById(req.params.id)
			.then(trail => {
				if (trail.registeredUsers.filter(regUser => regUser.user.toString() === req.user.id).length > 0) {
					return res.status(400).json({
						alreadyRegistered: 'User already registered to this trail'
					});
				}

				if (trail.started) {
					return res.status(400).json({
						trailStarted: 'This trail has already started, cannot join at this time'
					});
				}

				// Add user to registered users array
				trail.registeredUsers.unshift({ user: req.user.id });

				trail.save().then(trail => res.json(trail));
			})
			.catch(err => res.status(404).json({ trailnotfound: 'No Trail Found' }));
	});
});

// @route   POST api/trails/deregister/:trail_id
// @desc    Deregister a user from a trail
// @access  Private
router.post('/deregister/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	User.findOne({ user: req.user.id }).then(user => {
		Trail.findById(req.params.id)
			.then(trail => {
				if (trail.registeredUsers.filter(regUser => regUser.user.toString() === req.user.id).length === 0) {
					return res.status(400).json({
						alreadyRegistered: 'User has not yet registered to this trail'
					});
				}

				const removeIndex = trail.registeredUsers.map(item => item.user.toString()).indexOf(req.user.id);

				trail.registeredUsers.splice(removeIndex, 1);

				trail.save().then(trail => res.json(trail));
			})
			.catch(err => res.status(404).json({ trailnotfound: 'No Trail Found' }));
	});
});

// @route   POST api/trails/start-trail/:trail_id
// @desc    Flags a trail as started then creates teams based on registered users
// @access  Private
router.post('/start-trail/:id', (req, res) => {
	Trail.findById(req.params.id).then(trail => {
		if (trail.started) {
			return res.status(400).json({
				alreadyStarted: 'This trail has already started'
			});
		}

		// get the users registered to this trail
		let teamMembers = trail.registeredUsers;

		// ideal number in a team is 4, if the total number of users does not evenly divide into 4, an additional team will be made. At this time there is no means to balance teams so a team with one person is currently possible though not desirable.
		let numberOfTeams = 0;
		if (teamMembers.length % 4 === 0) {
			numberOfTeams = teamMembers.length / 4;
		} else {
			numberOfTeams = parseInt(teamMembers.length / 4) + 1;
		}

		// Based on the planned number of teams, iterate and create new Team instances in the database, taking the trail id and the stages from trail
		while (numberOfTeams > 0) {
			const newTeam = new Team({
				trail: req.params.id,
				stages: trail.stages
			});

			// Save the team to database then pick users at random from the pool of registered users and seed the teams with up to 4 users. If there are no users left to add but the process has not completed, the loop will iterate to the end and finish.
			newTeam
				.save()
				.then(team => {
					for (let i = 0; i < 4; i++) {
						if (teamMembers.length === 0) {
						} else {
							let newMember = teamMembers.splice(Math.floor(Math.random() * teamMembers.length), 1);
							team.members.push(newMember[0]);
						}
					}
					// Populate the teammates array for each user
					team.members.forEach(user => {
						team.members.forEach(teamMate => {
							if (teamMate !== user) {
								user.teammates.push(teamMate);
							}
						});
					});

					team.save().catch(err => res.status(404).json(err));
				})
				.catch(err => res.status(404).json(err));

			numberOfTeams--;
		}

		trail.started = true;
		trail.save().then(trail => res.json(trail));
	});
});

// @route   POST api/trails/end-trail/:trail_id
// @desc    Flags a trail as ended
// @access  Private
router.post('/end-trail/:id', (req, res) => {
	Trail.findById(req.params.id).then(trail => {
		if (trail.completed) {
			return res.status(400).json({
				alreadyCompleted: 'This trail has already been completed'
			});
		}

		trail.completed = true;
		trail.save().then(trail => res.json(trail));
	});
});

module.exports = router;
