import axios from 'axios';
import { GET_CLUE, GET_CLUES, CLUE_LOADING, GET_ERRORS } from '../actions/types';

// Get all clues for beacon
export const getAllClues = beacon_id => dispatch => {
	dispatch(setClueLoading());
	axios
		.get(`/api/beacons/clues/${beacon_id}`)
		.then(res =>
			dispatch({
				type: GET_CLUES,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Get one clue for beacon
export const getSingleClue = beacon_id => dispatch => {
	dispatch(setClueLoading());
	axios
		.get(`/api/beacons/clues/single/${beacon_id}`)
		.then(res =>
			dispatch({
				type: GET_CLUE,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_CLUE,
				payload: null
			})
		);
};

// Clue Loading
export const setClueLoading = () => {
	return {
		type: CLUE_LOADING
	};
};
