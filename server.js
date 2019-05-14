/* 
The main JavaScript file to run the NCLusion API. Routes will be defined in separate files and called from this file.

@author Andrew Brown
*/

// Import node packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const path = require('path');

// Load routes
const users = require('./routes/api/users');
const beacons = require('./routes/api/beacons');
const trails = require('./routes/api/trails');
const teams = require('./routes/api/teams');

// Load .env file for keys and variables
dotenv.config();

// Initialise app
const app = express();

// Connect to MongoDB
mongoose
	.connect(process.env.DB_URI, {
		useNewUrlParser: true
	})
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));

// Body parser middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/beacons', beacons);
app.use('/api/trails', trails);
app.use('/api/teams', teams);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
	// Set static folder
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// Declare port to run server on. Option between the server defined port OR use manually defined port (7500)
const port = process.env.PORT || 7500;

// Start application
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
