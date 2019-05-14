/*
Defines a MongoDB model/schema for Trails

@author Andrew Brown
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TrailSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	stages: [
		{
			beacon: {
				type: Schema.Types.ObjectId,
				ref: 'beacons',
				required: true
			}
		}
	],
	registeredUsers: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			}
		}
	],
	started: {
		type: Boolean,
		default: false
	},
	completed: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Trail = mongoose.model('trails', TrailSchema);
