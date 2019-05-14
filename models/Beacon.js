/*
Defines a MongoDB model/schema for Beacons using GeoJSON points

@author Andrew Brown
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BeaconSchema = new Schema({
	name: String,
	location: {
		type: {
			type: String,
			enum: ['Point'],
			required: true,
			default: 'Point'
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	clues: [
		{
			clue: {
				type: String,
				required: true
			}
		}
	],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Beacon = mongoose.model('beacons', BeaconSchema);
