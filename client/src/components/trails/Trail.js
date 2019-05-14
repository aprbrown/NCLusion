import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getTrail, registerTrail, deregisterTrail } from '../../actions/trailActions';

class Trail extends Component {
	componentDidMount() {
		this.props.getTrail(this.props.match.params.trail_id);
	}

	onRegisterClick(trail_id) {
		this.props.registerTrail(trail_id);
	}

	onDeregisterClick(trail_id) {
		this.props.deregisterTrail(trail_id);
	}

	render() {
		const { user } = this.props.auth;
		const { trail, loading } = this.props.trail;
		let trailContent = [];
		let startedStatus;
		let registerButton;

		if (trail === null || loading) {
			trailContent = (
				<div className='progress'>
					<div className='indeterminate' />
				</div>
			);
		} else {
			let reguser;
			for (let i of Object.values(trail.registeredUsers)) {
				if (i.user === user.id) {
					reguser = i.user;
				}
			}

			if (trail.started) {
				startedStatus = <span>Trail has already started</span>;
			} else {
				startedStatus = <span>Trail has not yet started</span>;

				if (reguser) {
					registerButton = (
						<button
							onClick={this.onDeregisterClick.bind(this, trail._id)}
							type='button'
							className='waves-effect waves-light btn-large red'
						>
							Unregister
						</button>
					);
				} else {
					registerButton = (
						<button
							onClick={this.onRegisterClick.bind(this, trail._id)}
							type='button'
							className='waves-effect waves-light btn-large'
						>
							Register
						</button>
					);
				}
			}

			trailContent = (
				<div className='row'>
					<ul className='collection with-header'>
						<li className='collection-header'>
							<h4>{trail.name}</h4>
						</li>
						<li className='collection-item'>
							<div>
								Number of Stages
								<a href='#!' className='secondary-content'>
									<span className='badge'>{trail.stages.length}</span>
								</a>
							</div>
						</li>
						<li className='collection-item'>
							<div>
								Number of Registered Users
								<a href='#!' className='secondary-content'>
									<span className='badge'>{trail.registeredUsers.length}</span>
								</a>
							</div>
						</li>
						<li className='collection-item'>
							<div>{startedStatus}</div>
						</li>
					</ul>
					{registerButton}
				</div>
			);
		}

		return <main>{trailContent}</main>;
	}
}

Trail.propTypes = {
	getTrail: PropTypes.func,
	registerTrail: PropTypes.func,
	deregisterTrail: PropTypes.func,
	trail: PropTypes.object,
	auth: PropTypes.object
};

const mapStateToProps = state => ({
	trail: state.trail,
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ getTrail, registerTrail, deregisterTrail }
)(Trail);
