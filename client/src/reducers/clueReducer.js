import { GET_CLUE, GET_CLUES, CLUE_LOADING } from '../actions/types';

const initialState = {
	clue: null,
	clues: null,
	loading: false
};

export default function(state = initialState, action) {
	switch (action.type) {
		case CLUE_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_CLUE:
			return {
				...state,
				clue: action.payload,
				loading: false
			};
		case GET_CLUES:
			return {
				...state,
				clues: action.payload,
				loading: false
			};
		default:
			return state;
	}
}
