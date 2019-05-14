import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import M from 'materialize-css';
import { getTeammates, meetTeammate } from '../../actions/teamActions';

class MeetTeammate extends Component {
	constructor(props) {
		super(props);
		this.state = {
			teammatename: ''
		};

		this.onChange = this.onChange.bind(this);
	}

	componentDidMount() {
		this.props.getTeammates(this.props.match.params.team_id);
		M.AutoInit();
	}

	onChange = e => {
		this.setState({ teammatename: e.target.value });
	};

	render() {
		const { user } = this.props.auth;
		const { teammates, loading } = this.props.team;

		let teammateForm = [];
		let teammateContent = [];

		if (teammates === null || loading) {
			teammateContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			let teamMate = teammates[this.props.match.params.teammate_key];
			let team_id = this.props.match.params.team_id;

			teammateContent.push(
				<div className='row'>
					<ul class='collection'>
						<li class='collection-item'>{teamMate.user.question}</li>
						<li class='collection-item'>{teamMate.user.answer}</li>
					</ul>
				</div>
			);

			teammateForm.push(
				<div className='row'>
					<form className='col s12'>
						<div className='row'>
							<div className='input-field col s12'>
								<input
									placeholder='Name'
									id='first_name'
									type='text'
									className='validate'
									teammatename={this.state.teammatename}
									onChange={this.onChange}
								/>
								<span className='helper-text'>Enter the name of this team mate</span>
							</div>
						</div>
					</form>
				</div>
			);

			if (this.state.teammatename === teamMate.user.name) {
				console.log(team_id);
				console.log(user.id);
				console.log(teamMate.user._id);
				this.setState({
					teammatename: ''
				});
				this.props.meetTeammate(team_id, user.id, teamMate.user._id);
				this.props.history.push(`/team/meet-team/${team_id}`);
			}
		}

		return (
			<main>
				{teammateContent}
				{teammateForm}
			</main>
		);
	}
}

MeetTeammate.propTypes = {
	getTeammates: PropTypes.func,
	meetTeammate: PropTypes.func,
	team: PropTypes.object,
	auth: PropTypes.object,
	errors: PropTypes.object
};

const mapStateToProps = state => ({
	team: state.team,
	teammateName: state.teammateName,
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ getTeammates, meetTeammate }
)(MeetTeammate);
