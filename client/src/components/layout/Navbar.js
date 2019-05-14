import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SideNav } from 'react-materialize';
import { logoutUser } from '../../actions/authActions';

class Navbar extends Component {
	onLogoutClick(e) {
		e.preventDefault();
		this.props.logoutUser();
	}

	render() {
		const { isAuthenticated, user } = this.props.auth;

		const authLinks = (
			<SideNav id='mobile-sidebar' className='sidenav'>
				<li className='indigo-text center-align'>{user.name}</li>
				<li className='indigo-text center-align'>{user.email}</li>
				<div className='divider' />
				<li className='center-align'>
					<Link className='nav-link' to='/dashboard'>
						Dashboard
					</Link>
				</li>
				<li className='center-align'>
					<Link className='nav-link' to='/trails'>
						Trails
					</Link>
				</li>
				<li className='center-align'>
					<Link className='nav-link' to='/teams'>
						Teams
					</Link>
				</li>
				<li className='center-align'>
					<button
						onClick={this.onLogoutClick.bind(this)}
						className='waves-effect waves-light btn-small red accent-4'
					>
						Logout
					</button>
				</li>
			</SideNav>
		);

		const guestLinks = (
			<SideNav id='mobile-sidebar' className='sidenav'>
				<li className='center-align'>
					<Link className='nav-link' to='/login'>
						Login
					</Link>
				</li>
				<li className='center-align'>
					<Link className='nav-link' to='/register'>
						Register
					</Link>
				</li>
			</SideNav>
		);

		return (
			<nav>
				<div className='nav-wrapper indigo lighten-2'>
					<a href='/' className='brand-logo'>
						NCLusion
					</a>

					<a href='/#' data-target='mobile-sidebar' className='sidenav-trigger'>
						<i className='material-icons'>menu</i>
					</a>
					{isAuthenticated ? authLinks : guestLinks}
				</div>
			</nav>
		);
	}
}

Navbar.propTypes = {
	logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ logoutUser }
)(Navbar);
