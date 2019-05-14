import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import trailReducer from './trailReducer';
import teamReducer from './teamReducer';
import clueReducer from './clueReducer';

export default combineReducers({
	auth: authReducer,
	errors: errorReducer,
	trail: trailReducer,
	team: teamReducer,
	clue: clueReducer
});
