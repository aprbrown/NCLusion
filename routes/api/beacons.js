/*
Defines routes for beacon interacton

@author Andrew Brown
*/

// Import node modules
const express = require('express');
const mongoose = require('mongoose');

// Import beacon model
const Beacon = require('../../models/Beacon');

// Load beacon validation
const validateBeaconInput = require('../../validation/beacon');

const router = express.Router();

// @route   GET api/beacons/test
// @desc    Testing for beacons route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Beacons is Accessible' }));

// @route   GET api/beacons/:beacon_id
// @desc    Get beacon by beacon ID
// @access  Public
router.get('/:id', (req, res) => {
	const errors = {};
	Beacon.findById(req.params.id)
		.then(beacon => res.json(beacon))
		.catch(err => res.status(404).json({ beacon: 'Beacon does not exist' }));
});

// @route   GET api/beacons/clues/:beacon_id
// @desc    Get clues by beacon ID
// @access  Public
router.get('/clues/:id', (req, res) => {
	const errors = {};
	Beacon.findById(req.params.id)
		.then(beacon => {
			let clues = [];
			beacon.clues.forEach(clue => {
				clues.push(clue);
			});
			res.json(clues);
		})
		.catch(err => res.status(404).json({ beacon: 'Beacon does not exist' }));
});

// @route   GET api/beacons/clues/:beacon_id
// @desc    Get clues by beacon ID
// @access  Public
router.get('/clues/single/:id', (req, res) => {
	const errors = {};
	Beacon.findById(req.params.id)
		.then(beacon => {
			let clues = [];
			beacon.clues.forEach(clue => {
				clues.push(clue);
			});
			let randomClue = clues.splice(Math.floor(Math.random() * clues.length), 1);
			res.json(randomClue);
		})
		.catch(err => res.status(404).json({ beacon: 'Beacon does not exist' }));
});

// @route   POST api/beacons/create
// @desc    Create a new beacon using geoJSON as coordinate format (longitude first) - This is public for now but should be protected behind and authorisation layer
// @access  Public
router.post('/create', (req, res) => {
	const { errors, isValid } = validateBeaconInput(req.body);

	if (!isValid) {
		return res.status(400).json(errors);
	}

	const beaconFields = {};
	if (req.body.name) beaconFields.name = req.body.name;
	beaconFields.location = {};
	let coords = [];
	if (req.body.longitude) coords.push(req.body.longitude);
	if (req.body.latitude) coords.push(req.body.latitude);

	beaconFields.location.coordinates = coords;

	Beacon.findOne({
		name: req.body.name
	}).then(beacon => {
		if (beacon) {
			errors.name = 'Beacon name already exists';
			return res.status(400).json({ errors });
		} else {
			const newBeacon = new Beacon(beaconFields);

			newBeacon.save().then(beacon => res.json(beacon));
		}
	});
});

// @route   POST api/beacons/create-clue/:beacon_id
// @desc    Add a clue to a beacon
// @access  Public
router.post('/create-clue/:beacon_id', (req, res) => {
	Beacon.findById(req.params.beacon_id).then(beacon => {
		const newClue = {
			clue: req.body.clue
		};

		beacon.clues.push(newClue);

		beacon
			.save()
			.then(beacon => res.json(beacon))
			.catch(err => res.status(404).json({ beaconnotfound: 'No Beacon Found' }));
	});
});

module.exports = router;
