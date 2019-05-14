import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getUserTrails } from '../../actions/trailActions';
import { getUserTeams } from '../../actions/teamActions';

class Dashboard extends Component {
	componentDidMount() {
		const { user } = this.props.auth;
		this.props.getUserTrails(user.id);
		this.props.getUserTeams();
	}

	render() {
		const { user } = this.props.auth;
		const { trails, loading } = this.props.trail;
		const teamsLoading = this.props.teams.loading;
		const { teams } = this.props.teams;

		console.log(teams);

		let trailsContent = [];
		let teamsContent = [];

		if (trails === null || loading) {
			trailsContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			if (Object.keys(trails).length === 0) {
				trailsContent.push(
					<li className='collection-item'>
						<div>
							<span>You have not registered to any trails</span>
						</div>
					</li>
				);
			}

			if (Object.keys(trails).length > 0) {
				Object.keys(trails).forEach(function(key) {
					trailsContent.push(
						<li className='collection-item'>
							<div>
								<span className='badge teal lighten-2 black-text'>
									{trails[key].registeredUsers.length} users
								</span>

								<Link to={`/trail/${trails[key]._id}`}>{trails[key].name}</Link>
							</div>
						</li>
					);
				});
			}
		}

		if (teams === null || teamsLoading) {
			teamsContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			if (Object.keys(teams).length === 0) {
				teamsContent.push(
					<li className='collection-item'>
						<div>
							<span>You have not registered to any teams</span>
						</div>
					</li>
				);
			}

			if (Object.keys(teams).length > 0) {
				Object.keys(teams).forEach(function(key) {
					teamsContent.push(
						<li className='collection-item'>
							<div>
								<span className='badge teal lighten-2 black-text'>
									{teams[key].members.length} users
								</span>

								<Link to={`/team/${teams[key]._id}`}>{teams[key].trail.name}</Link>
							</div>
						</li>
					);
				});
			}
		}

		return (
			<main>
				<div className='container'>
					<div className='row'>
						<div className='col s12 m6'>
							<div className='card indigo lighten-2'>
								<div className='card-content white-text'>
									<span className='card-title'>Dashboard</span>
									<p>
										Welcome to <strong>NCLusion</strong> {user.name}
									</p>
								</div>
							</div>
						</div>
						<ul className='collection with-header'>
							<li className='collection-header'>
								<h5>Your Registered Trails</h5>
							</li>
							{trailsContent}
						</ul>
						<ul className='collection with-header'>
							<li className='collection-header'>
								<h5>Your Teams</h5>
							</li>
							{teamsContent}
						</ul>
					</div>
				</div>
			</main>
		);
	}
}

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
	getTrails: PropTypes.func,
	getTeams: PropTypes.func,
	trail: PropTypes.object
};

const mapStateToProps = state => ({
	auth: state.auth,
	trail: state.trail,
	teams: state.team
});

export default connect(
	mapStateToProps,
	{ getUserTrails, getUserTeams }
)(Dashboard);
