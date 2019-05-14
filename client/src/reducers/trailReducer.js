import { GET_TRAIL, GET_TRAILS, TRAIL_LOADING } from '../actions/types';

const initialState = {
	trail: null,
	trails: null,
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case TRAIL_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_TRAIL:
			return {
				...state,
				trail: action.payload,
				loading: false
			};
		case GET_TRAILS:
			return {
				...state,
				trails: action.payload,
				loading: false
			};
		default:
			return state;
	}
}
