import {appActions, AppInitialStateType, appReducer} from './app-reducer'
import {UserDataType} from "common/types/common-types";


let startState: AppInitialStateType;

beforeEach(() => {
	startState = {
		error: null,
		status: 'idle',
		isInitialized: false,
		userData: null as UserDataType | null
	}
})

test('correct error message should be set', () => {
	const endState = appReducer(startState, appActions.setError({error: 'some error'}))
	expect(endState.error).toBe('some error');
})

test('correct status should be set', () => {
	const endState = appReducer(startState, appActions.setStatus({status: 'loading'}))
	expect(endState.status).toBe('loading');
})

