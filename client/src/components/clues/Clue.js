import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getSingleClue } from '../../actions/clueActions';
import { getTeam, completeStage } from '../../actions/teamActions';

class Clue extends Component {
	componentDidMount() {
		this.props.getSingleClue(this.props.match.params.beacon_id);
		this.props.getTeam(this.props.match.params.team_id);
	}

	onVerifyBeaconClick(team_id, beacon_id) {
		this.props.completeStage(team_id, beacon_id);
		this.props.history.push(`/team/${team_id}`);
	}

	render() {
		const { clue, loading } = this.props.clue;

		let clueContent = [];
		let stage = this.props.match.params.stage;

		let team_id = this.props.match.params.team_id;

		// TODO: This value needs to be taken from beacon instead of props
		let beacon_id = this.props.match.params.beacon_id;

		if (clue === null || loading) {
			clueContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			clueContent.push(<p className='flow-text'>{clue[0].clue}</p>);
		}

		return (
			<main>
				<div className='row'>
					<div className='col s12 m6'>
						<div className='card indigo lighten-2'>
							<div className='card-content white-text'>
								<span className='card-title'>Stage {stage} Clue</span>
								{clueContent}
							</div>
							<div className='card-action'>
								<a
									className='waves-effect waves-light btn-large'
									href={`/team/${this.props.match.params.team_id}`}
								>
									Back
								</a>

								<button
									onClick={this.onVerifyBeaconClick.bind(this, team_id, beacon_id)}
									type='button'
									className='waves-effect waves-light btn-large right'
								>
									Verify Beacon
								</button>
							</div>
						</div>
					</div>
				</div>
			</main>
		);
	}
}

Clue.propTypes = {
	getSingleClue: PropTypes.func,
	getTeam: PropTypes.func,
	completeStage: PropTypes.func,
	clue: PropTypes.object,
	beacon: PropTypes.object,
	team: PropTypes.object,
	auth: PropTypes.object
};

const mapStateToProps = state => ({
	clue: state.clue,
	beacon: state.beacon,
	team: state.team,
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ getSingleClue, getTeam, completeStage }
)(Clue);
