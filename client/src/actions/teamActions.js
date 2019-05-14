import axios from 'axios';
import { GET_TEAM, GET_TEAMS, GET_TEAMMATES, TEAM_LOADING, GET_ERRORS } from './types';

// Get user's Teams
export const getUserTeams = () => dispatch => {
	dispatch(setTeamLoading());
	axios
		.get('/api/teams/user')
		.then(res =>
			dispatch({
				type: GET_TEAMS,
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

// Get Team by team_id
export const getTeam = team_id => dispatch => {
	dispatch(setTeamLoading());
	axios
		.get(`/api/teams/team/${team_id}`)
		.then(res =>
			dispatch({
				type: GET_TEAM,
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

// Get Teammates
export const getTeammates = team_id => dispatch => {
	dispatch(setTeamLoading());
	axios
		.get(`/api/teams/teammates/${team_id}`)
		.then(res =>
			dispatch({
				type: GET_TEAMMATES,
				payload: res.data
			})
		)
		.catch(err =>
			dispatch({
				type: GET_TEAMMATES,
				payload: null
			})
		);
};

// Trigger completion of stage
export const completeStage = (team_id, beacon_id) => dispatch => {
	axios
		.post(`/api/teams/complete-stage/${team_id}/${beacon_id}`)
		.then(res => dispatch(getTeam(team_id)))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Set a teammate as met
export const meetTeammate = (team_id, user_id, teammate_id) => dispatch => {
	axios
		.post(`/api/teams/meet-teammate/${team_id}/${user_id}/${teammate_id}`)
		.then(res => dispatch(getTeam(team_id)))
		.catch(err =>
			dispatch({
				type: GET_ERRORS,
				payload: err.response.data
			})
		);
};

// Team Loading
export const setTeamLoading = () => {
	return {
		type: TEAM_LOADING
	};
};
