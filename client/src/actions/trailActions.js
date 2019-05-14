import axios from 'axios';
import { GET_TRAIL, GET_TRAILS, TRAIL_LOADING, GET_ERRORS } from './types';

// Get all trails
export const getAllTrails = () => dispatch => {
	dispatch(setTrailLoading());
	axios
		.get('/api/trails/all')
		.then(res =>
			dispatch({
				type: GET_TRAILS,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_TRAILS,
				payload: null
			})
		);
};

// Get trail by trail_id
export const getTrail = trail_id => dispatch => {
	dispatch(setTrailLoading());
	axios
		.get(`/api/trails/${trail_id}`)
		.then(res =>
			dispatch({
				type: GET_TRAIL,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_TRAIL,
				payload: null
			})
		);
};

// Get user's trails
export const getUserTrails = user_id => dispatch => {
	dispatch(setTrailLoading());
	axios
		.get(`/api/trails/my-trails/${user_id}`)
		.then(res =>
			dispatch({
				type: GET_TRAILS,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_TRAILS,
				payload: null
			})
		);
};

// Register user to trail
export const registerTrail = trail_id => dispatch => {
	axios
		.post(`/api/trails/register/${trail_id}`)
		.then(res => dispatch(getTrail(trail_id)))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Deregister user to trail
export const deregisterTrail = trail_id => dispatch => {
	axios
		.post(`/api/trails/deregister/${trail_id}`)
		.then(res => dispatch(getTrail(trail_id)))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Trail Loading
export const setTrailLoading = () => {
	return {
		type: TRAIL_LOADING
	};
};
