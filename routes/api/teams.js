/*
Defines routes for team interacton

@author Andrew Brown
*/

// Import node modules
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

// Import team model
const Team = require('../../models/Team');

const isEmpty = require('../../validation/is-empty');

const router = express.Router();

// @route   GET api/teams/test
// @desc    Testing for teams route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Teams is Accessible' }));

// @route   GET api/teams/team/:team_id
// @desc    Get team by team ID
// @access  Public
router.get('/team/:id', (req, res) => {
	const errors = {};
	Team.findById(req.params.id)
		.populate('trail', 'name')
		.populate('stages.beacon')
		.populate('members.user')
		.then(team => {
			if (!team) {
				errors.noteam = 'No team matches';
				return res.status(404).json(errors);
			}

			res.json(team);
		})
		.catch(err => res.status(404).json({ team: 'Team does not exist' }));
});

// @route   GET api/teams/user
// @desc    Get teams associated with a user
// @access  Private
router.get('/user', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	User.findOne({ user: req.user.id }).then(user => {
		Team.find({ members: { $elemMatch: { user: req.user.id } } })
			.populate('trail', 'name')
			.populate('stages.beacon')
			.populate('members.user', 'name')
			.then(teams => {
				if (!teams) {
					errors.noteam = 'There are no teams';
					return res.status(404).json(errors);
				}

				res.json(teams);
			})
			.catch(err => res.status(404).json({ team: 'There are no teams associated with this user' }));
	});
});

// @route   GET api/teams/trail/:trail_id
// @desc    Get teams by trail ID
// @access  Public
router.get('/trail/:id', (req, res) => {
	const errors = {};
	Team.find({ trail: req.params.id })
		.then(teams => res.json(teams))
		.catch(err => res.status(404).json({ team: 'Teams not associated with that trail' }));
});

// @route   POST api/teams/complete-stage/:team_id/:beacon_id
// @desc    Change stage completion status to true when reaching beacon
// @access  Private
router.post('/complete-stage/:team_id/:beacon_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Team.findById(req.params.team_id)
		.then(team => {
			let nextStage;
			for (let stage of team.stages) {
				if (stage.completed === false) {
					nextStage = stage;
					break;
				}
			}

			if (nextStage.beacon.toString() === req.params.beacon_id) {
				nextStage.completed = true;
			}

			team.save()
				.then(team => res.json(team))
				.catch(err => res.status(404).json(err));
		})
		.catch(err => res.status(404).json(err));
});

// @route   POST api/teams/complete-trail/:team_id
// @desc    Change trail completion status to true when all stages are complete
// @access  Private
router.post('/complete-trail/:team_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};
	Team.findById(req.params.team_id)
		.then(team => {
			for (let stage of team.stages) {
				if (stage.completed === false) {
					errors.notcomplete = 'There are still stages to complete';
					res.status(400).json(errors);
				}
			}

			if (isEmpty(errors)) {
				team.completed = true;
			}

			team.save()
				.then(team => res.json(team))
				.catch(err => res.status(404).json(err));
		})
		.catch(err => res.status(404).json(err));
});

// @route   GET api/teams/teammates/:team_id
// @desc    Get logged in user's teammates
// @access  Private
router.get('/teammates/:team_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Team.findById(req.params.team_id)
		.populate('members.teammates.user')
		.then(team => {
			let targetUser;

			team.members.forEach(user => {
				if (user.user.toString() === req.user.id) {
					targetUser = user;
				}
			});
			let teammates = targetUser.teammates;

			res.json(teammates);
		})
		.catch(err => res.status(404).json(err));
});

// @route   POST api/teams/meet-teammate/:team_id/:user_id/:teammate_id
// @desc    Mark a teammate as met - Very inefficient could do with a refactor
// @access  Private
router.post(
	'/meet-teammate/:team_id/:user_id/:teammate_id',
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		const errors = {};
		Team.findById(req.params.team_id)
			.then(team => {
				let targetUser;

				team.members.forEach(user => {
					if (user.user.toString() === req.params.user_id) {
						targetUser = user;
					}
				});

				targetUser.teammates.forEach(teammate => {
					if (teammate.user.toString() === req.params.teammate_id) {
						teammate.met = true;
					}
				});

				team.save()
					.then(team => res.json(team))
					.catch(err => res.status(404).json(err));
			})
			.catch(err => res.status(404).json(err));
	}
);

module.exports = router;
