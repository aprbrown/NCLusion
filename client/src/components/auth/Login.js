import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
	constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			errors: {}
		};
	}

	onChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	componentDidMount() {
		if (this.props.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.auth.isAuthenticated) {
			this.props.history.push('/dashboard');
		}

		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onSubmit = e => {
		e.preventDefault();

		const userData = {
			email: this.state.email,
			password: this.state.password
		};

		this.props.loginUser(userData);
	};

	render() {
		const { errors } = this.state;

		return (
			<div className='login'>
				<div className='row'>
					<div className='col s12'>
						<h1 className='center-align'>Log In</h1>
						<p className='center-align flow-text'>Sign in to your NCLusion account</p>
						<form onSubmit={this.onSubmit}>
							<TextFieldGroup
								placeholder='Email Address'
								name='email'
								type='email'
								value={this.state.email}
								onChange={this.onChange}
								error={errors.email}
							/>

							<TextFieldGroup
								placeholder='Password'
								name='password'
								type='password'
								value={this.state.password}
								onChange={this.onChange}
								error={errors.password}
							/>

							<input type='submit' className='btn btn-info btn-block mt-4' />
						</form>
					</div>
				</div>
			</div>
		);
	}
}

Login.propTypes = {
	loginUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ loginUser }
)(Login);
