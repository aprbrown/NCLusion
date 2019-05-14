import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import M from 'materialize-css';
import { getTeammates, completeStage, getTeam } from '../../actions/teamActions';

class MeetTeam extends Component {
	componentDidMount() {
		this.props.getTeammates(this.props.match.params.team_id);
		this.props.getTeam(this.props.match.params.team_id);
		let elem = document.querySelector('.collapsible.expandable');
		M.Collapsible.init(elem, {
			accordion: false
		});
	}

	onVerifyBeaconClick(team_id, beacon_id) {
		this.props.completeStage(team_id, beacon_id);
		this.props.history.push(`/team/${team_id}`);
	}

	render() {
		const { user } = this.props.auth;
		const { team, teammates, loading } = this.props.team;

		const team_id = this.props.match.params.team_id;

		let meetingContent = [];
		let verifyButton = [];

		if (teammates == null || loading) {
			meetingContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			let metStatus = [];

			//TODO: Get beaconid from bluetooth
			let beacon_id = team.stages[0].beacon._id;
			if (Object.keys(teammates).length > 0) {
				Object.keys(teammates).forEach(function(key) {
					if (teammates[key].user._id !== user.id) {
						metStatus.push(teammates[key].met);

						if (teammates[key].met) {
							meetingContent.push(
								<li>
									<div className='collapsible-header green white-text'>
										<span>{teammates[key].user.name}</span>
									</div>
								</li>
							);
						} else {
							meetingContent.push(
								<li>
									<div className='collapsible-header'>
										<span>{teammates[key].user.question}: &emsp;</span>
										<span>{teammates[key].user.answer}</span>
									</div>

									<div className='collapsible-body'>
										<Link to={`/team/meet-teammate/${team_id}/${key}`}>
											<div className='waves-effect waves-light btn-large'>Name Team Mate</div>
										</Link>
									</div>
								</li>
							);
						}
					}
				});
			}
			if (!metStatus.includes(false)) {
				verifyButton.push(
					<button
						onClick={this.onVerifyBeaconClick.bind(this, team_id, beacon_id)}
						type='button'
						className='waves-effect waves-light btn-large right'
					>
						Verify Beacon
					</button>
				);
			} else {
				verifyButton.push(
					<button type='button' className='waves-effect waves-light btn-large right disabled'>
						Verify Beacon
					</button>
				);
			}
		}

		return (
			<main>
				<ul className='collection with-header'>
					<li className='collection-header'>
						<h4>Meet your team</h4>
					</li>
				</ul>
				<ul className='collapsible expandable'>{meetingContent}</ul>
				<a className='waves-effect waves-light btn-large' href={`/team/${this.props.match.params.team_id}`}>
					Back
				</a>
				{verifyButton}
			</main>
		);
	}
}

MeetTeam.propTypes = {
	getTeammates: PropTypes.func,
	getTeam: PropTypes.func,
	completeStage: PropTypes.func,
	team: PropTypes.object,
	auth: PropTypes.object,
	errors: PropTypes.object
};

const mapStateToProps = state => ({
	team: state.team,
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ getTeammates, completeStage, getTeam }
)(MeetTeam);
