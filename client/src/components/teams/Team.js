import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Collapsible } from 'react-materialize';
import GoogleMapReact from 'google-map-react';
import { getTeam } from '../../actions/teamActions';

class Team extends Component {
	componentDidMount() {
		this.props.getTeam(this.props.match.params.team_id);
	}

	render() {
		const { team, loading } = this.props.team;

		let stagesContent = [];
		let beaconMarkers = [];
		let title;

		let center = {
			lat: 54.97362,
			lng: -1.613153
		};
		let zoom = 13;

		if (team === null || loading) {
			stagesContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			title = team.trail.name;

			let team_id = team._id;

			if (Object.keys(team.stages).length > 0) {
				Object.keys(team.stages).forEach(function(key) {
					let stageNumber = 1 + parseInt(key);
					let completedBadge;

					if (team.stages[key].completed) {
						completedBadge = (
							<span key={team.stages} className='new badge' data-badge-caption='Completed' />
						);
						beaconMarkers.push(
							<Marker
								lat={team.stages[key].beacon.location.coordinates[1]}
								lng={team.stages[key].beacon.location.coordinates[0]}
							/>
						);
					} else {
						completedBadge = (
							<span key={team.stages} className='new badge red' data-badge-caption='Not Completed' />
						);
					}

					if (stageNumber === 1) {
						if (team.stages[key].completed) {
							stagesContent.push(
								<li>
									<div className='collapsible-header'>
										Stage {stageNumber}
										{completedBadge}
									</div>
									<div className='collapsible-body'>
										<p className='flow-text'>{team.stages[key].beacon.name}</p>
									</div>
								</li>
							);
						} else {
							stagesContent.push(
								<li>
									<div className='collapsible-header'>
										Stage {stageNumber}
										{completedBadge}
									</div>
									<div className='collapsible-body'>
										<p className='flow-text'>
											This is the first stage of the trail, goto the marker on the map to meet
											your team
										</p>
										<Link to={`/team/meet-team/${team_id}`}>
											<div className='waves-effect waves-light btn-large'>Meet your team</div>
										</Link>
									</div>
								</li>
							);
						}

						beaconMarkers.push(
							<Marker
								lat={team.stages[key].beacon.location.coordinates[1]}
								lng={team.stages[key].beacon.location.coordinates[0]}
							/>
						);
					} else if (team.stages[key - 1].completed) {
						let stage = team.stages[key];

						if (!team.stages[key].completed) {
							stagesContent.push(
								<li>
									<div className='collapsible-header'>
										Stage {stageNumber}
										{completedBadge}
									</div>
									<div className='collapsible-body'>
										<Link to={`/team/${team_id}/clue/${stageNumber}/${stage.beacon._id}`}>
											<div className='waves-effect waves-light btn-large'>View Clue</div>
										</Link>
									</div>
								</li>
							);
						} else {
							stagesContent.push(
								<li>
									<div className='collapsible-header'>
										Stage {stageNumber}
										{completedBadge}
									</div>
									<div className='collapsible-body'>
										<p className='flow-text'>{team.stages[key].beacon.name}</p>
									</div>
								</li>
							);
						}
					} else {
						stagesContent.push(
							<li>
								<div className='collapsible-header'>
									Stage {stageNumber}
									{completedBadge}
								</div>
							</li>
						);
					}
				});
			}
		}

		return (
			<main>
				<h4 className='center-align'>{title}</h4>
				<Collapsible accordion={false}>{stagesContent}</Collapsible>
				<div id='mapid'>
					<GoogleMapReact
						bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
						defaultCenter={center}
						defaultZoom={zoom}
						yesIWantToUseGoogleMapApiInternals
					>
						{beaconMarkers}
					</GoogleMapReact>
				</div>
			</main>
		);
	}
}

const Marker = props => {
	return <div className='MapMarker' />;
};

Team.propTypes = {
	getTeam: PropTypes.func,
	team: PropTypes.object,
	auth: PropTypes.object
};

const mapStateToProps = state => ({
	team: state.team,
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ getTeam }
)(Team);
