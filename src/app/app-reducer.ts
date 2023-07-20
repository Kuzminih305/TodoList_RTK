import {authActions} from "features/Login/auth-reducer";
import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "features/Login/auth-api";
import {createAppAsyncThunk, handleServerNetworkError} from "common/utils";
import {UserDataType} from "common/types/common-types";





const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
    userData: null as UserDataType | null
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.userData = action.payload.user
            })
    }
})

const initializeApp = createAppAsyncThunk<
    {user: UserDataType},
    void
>('app/initializeApp', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
      const res =  await authAPI.me()
            if (res.data.resultCode === 0) {
                dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
                return {user: res.data.data}
            } else {
                // handleServerAppError(res.data, dispatch)
                return rejectWithValue(null)
            }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    } finally {
        dispatch(appActions.setIsInitialized({isInitialized: true}))
    }
})
// export const initializeAppTC = () => (dispatch: Dispatch) => {
//     authAPI.me().then(res => {
//         if (res.data.resultCode === 0) {
//             dispatch(authActions.setIsLoggedIn({isLoggedIn: true}));
//         } else {
//         }
//         dispatch(appActions.setIsInitialized({isInitialized: true}))
//     })
// }
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export const appReducer = slice.reducer
export const appActions = slice.actions
export const appThunks = {initializeApp}