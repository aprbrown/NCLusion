/*
Defines a MongoDB model/schema for Teams

@author Andrew Brown
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TeamSchema = new Schema({
	members: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			},
			teammates: [
				{
					user: {
						type: Schema.Types.ObjectId,
						ref: 'users'
					},
					met: {
						type: Boolean,
						default: false
					}
				}
			]
		}
	],
	trail: {
		type: Schema.Types.ObjectId,
		ref: 'trails'
	},
	stages: [
		{
			beacon: {
				type: Schema.Types.ObjectId,
				ref: 'beacons'
			},
			completed: {
				type: Boolean,
				default: false
			}
		}
	],
	completed: {
		type: Boolean,
		default: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Team = mongoose.model('teams', TeamSchema);
