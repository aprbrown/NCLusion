import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

class Landing extends Component {
	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	render() {
		return (
			<main>
				<h1 className='center-align'>NCLusion</h1>

				<div className='row'>
					<div className='col s12'>
						<Link to='login' className='btn btn-large blue waves-effect waves-light'>
							Login
						</Link>
					</div>
				</div>

				<div className='row'>
					<div className='col s12'>
						<Link to='register' className='btn btn-large blue waves-effect waves-light'>
							Register
						</Link>
					</div>
				</div>
			</main>
		);
	}
}

Landing.propTypes = {
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(mapStateToProps)(Landing);
