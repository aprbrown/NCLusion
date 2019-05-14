import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextAreaFieldGroup = ({ name, placeholder, value, error, info, onChange }) => {
	return (
		<div className='input-field col s12'>
			<textarea
				className={classnames('materialize-textarea', {
					'is-invalid': error
				})}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
			/>
			{info && <span className='helper-text'>{info}</span>}
			{error && <span className='helper-text red-text'>{error}</span>}
		</div>
	);
};

TextAreaFieldGroup.propTypes = {
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	value: PropTypes.string.isRequired,
	info: PropTypes.string,
	error: PropTypes.string,
	onChange: PropTypes.func.isRequired
};

export default TextAreaFieldGroup;
