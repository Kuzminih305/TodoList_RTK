import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {authAPI, LoginParamsType} from "features/Login/auth-api";




const slice = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: false
    },
    reducers: {
        setIsLoggedIn: (state, action: PayloadAction<{isLoggedIn: boolean}>) => {
            // return {...state, isLoggedIn: action.value}
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
    }
})

const login = createAppAsyncThunk<
    {isLoggedIn: boolean},
    LoginParamsType
>('auth/login', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setStatus({status: 'loading'}))
        const res = await authAPI.login(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setStatus({status: 'succeeded'}))
           return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, dispatch)
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
// export const loginTC = (data: LoginParamsType): AppThunk => (dispatch) => {
//     dispatch(appActions.setStatus({status :'loading'}))
//     authAPI.login(data)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(authActions.setIsLoggedIn({isLoggedIn: true}))
//                 dispatch(appActions.setStatus({status :'succeeded'}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch((error) => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

const logout = createAppAsyncThunk<
    {isLoggedIn: boolean}
>('auth/logout', async (_, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setStatus({status :'loading'}))
       const res = await authAPI.logout()
                if (res.data.resultCode === 0) {
                    dispatch(appActions.setStatus({status :'succeeded'}))
                    return {isLoggedIn: false}
                } else {
                    handleServerAppError(res.data, dispatch)
                    return rejectWithValue(null)
                }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})
export const authReducer = slice.reducer
export const authActions = slice.actions
export const authThunks = {login, logout}