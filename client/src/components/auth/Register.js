import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import M from 'materialize-css';
import { registerUser } from '../../actions/authActions';
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
	constructor() {
		super();
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			question: '',
			answer: '',
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

		M.AutoInit();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	onSubmit = e => {
		e.preventDefault();

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2,
			question: this.state.question,
			answer: this.state.answer
		};

		this.props.registerUser(newUser, this.props.history);
	};

	render() {
		const { errors } = this.state;

		return (
			<main>
				<div className='row'>
					<div className='col s12'>
						<h1 className='center-align'>Sign Up</h1>
						<p className='center-aling flow-text'>Create your NCLusion account</p>

						<form onSubmit={this.onSubmit}>
							<div className='row'>
								<TextFieldGroup
									placeholder='Name'
									name='name'
									value={this.state.name}
									onChange={this.onChange}
									error={errors.name}
								/>
							</div>
							<div className='row'>
								<TextFieldGroup
									placeholder='Email Address'
									name='email'
									type='email'
									value={this.state.email}
									onChange={this.onChange}
									error={errors.email}
								/>
							</div>
							<div className='row'>
								<TextFieldGroup
									placeholder='Password'
									name='password'
									type='password'
									value={this.state.password}
									onChange={this.onChange}
									error={errors.password}
								/>
							</div>
							<div className='row'>
								<TextFieldGroup
									placeholder='Confirm Password'
									name='password2'
									type='password'
									value={this.state.password2}
									onChange={this.onChange}
									error={errors.password2}
								/>
							</div>

							<div className='row'>
								<div className='input-field col s12'>
									<select value={this.state.question} onChange={this.onChange} name='question'>
										<option value='' defaultValue>
											Select a question about yourself
										</option>
										<option value='Favourite Song'>Favourite Song</option>
										<option value='Favourite Band'>Favourite Band</option>
										<option value='Favourite Movie'>Favourite Movie</option>
										<option value='Favourite Actor'>Favourite Actor</option>
										<option value='Favourite Food'>Favourite Food</option>
										<option value='Favourite City'>Favourite City</option>
									</select>
								</div>
							</div>

							<div className='row'>
								<TextFieldGroup
									placeholder='Answer to Question'
									name='answer'
									value={this.state.answer}
									onChange={this.onChange}
									error={errors.answer}
								/>
							</div>

							<input type='submit' className='btn btn-info btn-block mt-4' />
						</form>
					</div>
				</div>
			</main>
		);
	}
}

Register.propTypes = {
	registerUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ registerUser }
)(withRouter(Register));
