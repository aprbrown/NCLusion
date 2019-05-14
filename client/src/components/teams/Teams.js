import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getUserTeams } from '../../actions/teamActions';

class Teams extends Component {
	componentDidMount() {
		this.props.getUserTeams();
	}

	render() {
		const { teams, loading } = this.props.team;
		let teamsContent = [];

		if (teams === null || loading) {
			teamsContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			if (Object.keys(teams).length > 0) {
				Object.keys(teams).forEach(function(key) {
					teamsContent.push(
						<li className='collection-item'>
							<Link to={`/team/${teams[key]._id}`}>
								<span className='badge teal lighten-2 black-text'>
									{teams[key].members.length} Members
								</span>
								{teams[key].trail.name}
							</Link>
						</li>
					);
				});
			} else {
				teamsContent.push(
					<li className='collection-item'>
						<p>You are not part of any teams yet, join a trail to get involved</p>
					</li>
				);
			}
		}

		return (
			<main>
				<ul className='collection with-header'>
					<li className='collection-header'>
						<h5>Your Teams</h5>
					</li>
					{teamsContent}
				</ul>
			</main>
		);
	}
}

Teams.propTypes = {
	getUserTeams: PropTypes.func,
	teams: PropTypes.object,
	team: PropTypes.object
};

const mapStateToProps = state => ({
	team: state.team,
	teams: state.teams
});

export default connect(
	mapStateToProps,
	{ getUserTeams }
)(Teams);
