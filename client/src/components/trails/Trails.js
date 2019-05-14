import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getAllTrails } from '../../actions/trailActions';

class Trails extends Component {
	componentDidMount() {
		this.props.getAllTrails();
	}

	render() {
		const { trails, loading } = this.props.trail;
		let trailsContent = [];

		if (trails === null || loading) {
			trailsContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			if (Object.keys(trails).length > 0) {
				Object.keys(trails).forEach(function(key) {
					let started;
					if (trails[key].started) {
						started = <span className='badge green black-text'>Started</span>;
					}
					trailsContent.push(
						<li className='collection-item'>
							<Link to={`/trail/${trails[key]._id}`}>
								<span className='badge teal lighten-2 black-text'>
									{trails[key].registeredUsers.length} users
								</span>
								{started}
								{trails[key].name}
							</Link>
						</li>
					);
				});
			}
		}

		return (
			<main>
				<ul className='collection with-header'>
					<li className='collection-header'>
						<h5>All Trails</h5>
					</li>
					{trailsContent}
				</ul>
			</main>
		);
	}
}

Trails.propTypes = {
	getAllTrails: PropTypes.func
};

const mapStateToProps = state => ({
	trail: state.trail
});

export default connect(
	mapStateToProps,
	{ getAllTrails }
)(Trails);
