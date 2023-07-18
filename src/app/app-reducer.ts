import {Dispatch} from 'redux'
import {authActions} from "features/Login/auth-reducer";
import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "features/Login/auth-api";





const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
}

export type AppInitialStateType = typeof initialState

const slice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setError: (state, action: PayloadAction<{ error: null | string }>) => {
            state.error = action.payload.error
        },
        setIsInitialized: (state, action: PayloadAction<{isInitialized: boolean}>) => {
            state.isInitialized = action.payload.isInitialized
        },
    }

})
export const appReducer = slice.reducer
export const appActions = slice.actions





export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
        } else {
        }
        dispatch(appActions.setIsInitialized({isInitialized: true}))
    })
}
