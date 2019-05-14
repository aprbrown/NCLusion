import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwtDecode from 'jwt-decode';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import Trails from './components/trails/Trails';
import PrivateRoute from './components/common/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import Trail from './components/trails/Trail';
import Teams from './components/teams/Teams';
import Team from './components/teams/Team';
import Clue from './components/clues/Clue';
import MeetTeam from './components/teams/MeetTeam';
import MeetTeammate from './components/teams/MeetTeammate';
import './App.css';

// Check for token
if (localStorage.jwtToken) {
	// Set auth token header auth
	setAuthToken(localStorage.jwtToken);
	// Decode token, get user info and expiration
	const decoded = jwtDecode(localStorage.jwtToken);
	// Set user and isAuthenticated
	store.dispatch(setCurrentUser(decoded));

	// Check for expired token
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		// Logout user
		store.dispatch(logoutUser());
		// Redirect to login
		window.location.href = '/login';
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className='App'>
						<Navbar />
						<Route exact path='/' component={Landing} />
						<div className='container'>
							<Route exact path='/login' component={Login} />
							<Route exact path='/register' component={Register} />
							<Switch>
								<PrivateRoute exact path='/dashboard' component={Dashboard} />
							</Switch>
							<Switch>
								<PrivateRoute exact path='/trails' component={Trails} />
							</Switch>
							<Switch>
								<PrivateRoute exact path='/trail/:trail_id' component={Trail} />
							</Switch>
							<Switch>
								<PrivateRoute exact path='/teams' component={Teams} />
							</Switch>
							<Switch>
								<PrivateRoute exact path='/team/:team_id' component={Team} />
							</Switch>
							<Switch>
								<PrivateRoute exact path='/team/:team_id/clue/:stage/:beacon_id' component={Clue} />
							</Switch>
							<Switch>
								<PrivateRoute exact path='/team/meet-team/:team_id' component={MeetTeam} />
							</Switch>
							<Switch>
								<PrivateRoute
									exact
									path='/team/meet-teammate/:team_id/:teammate_key'
									component={MeetTeammate}
								/>
							</Switch>
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
