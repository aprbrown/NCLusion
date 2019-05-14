import { GET_TEAM, GET_TEAMS, GET_TEAMMATES, TEAM_LOADING } from '../actions/types';

const initialState = {
	team: null,
	teams: null,
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case TEAM_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_TEAM:
			return {
				...state,
				team: action.payload,
				loading: false
			};
		case GET_TEAMS:
			return {
				...state,
				teams: action.payload,
				loading: false
			};
		case GET_TEAMMATES:
			return {
				...state,
				teammates: action.payload,
				loading: false
			};
		default:
			return state;
	}
}
