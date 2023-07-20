import React, { useCallback, useEffect } from 'react'
import './App.css'
import { ErrorSnackbar } from 'common/components/ErrorSnackbar/ErrorSnackbar'
import { useDispatch, useSelector } from 'react-redux'
import { AppRootStateType } from './store'
import {appThunks, RequestStatusType} from './app-reducer'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Login } from 'features/Login/Login'
import {
	AppBar,
	Button,
	CircularProgress,
	Container,
	IconButton,
	LinearProgress,
	Toolbar,
	Typography
} from '@mui/material';
import { Menu } from '@mui/icons-material'
import {TodoListsList} from "features/TodolistsList/TodolistsList";
import {authThunks} from "features/Login/auth-reducer";
import {UserDataType} from "common/types/common-types";

type PropsType = {
	demo?: boolean
}

function App({demo = false}: PropsType) {
	const status = useSelector<AppRootStateType, RequestStatusType>((state) => state.app.status)
	const isInitialized = useSelector<AppRootStateType, boolean>((state) => state.app.isInitialized)
	const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)
	const userData = useSelector<AppRootStateType, UserDataType | null>(state => state.app.userData)


	const dispatch = useDispatch<any>()

	useEffect(() => {
		dispatch(appThunks.initializeApp())
		// dispatch(appThunks.setUserData())
	}, [])

	const logoutHandler = useCallback(() => {
		dispatch(authThunks.logout())
	}, [])


	if (!isInitialized) {
		return <div
			style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
			<CircularProgress/>
			<ErrorSnackbar/>
		</div>
	}

	return (
		<BrowserRouter>
			<div className="App">
				<ErrorSnackbar/>
				<AppBar position="static">
					<Toolbar>
						<IconButton edge="start" color="inherit" aria-label="menu">
							<Menu/>
							<div></div>
						</IconButton>
						<Typography variant="h6">
							News
						</Typography>
						{isLoggedIn && <Button color="inherit" onClick={logoutHandler}>{userData?.login}</Button>}
						{/*<Button color="inherit" onClick={logoutHandler}></Button>*/}
					</Toolbar>
					{status === 'loading' && <LinearProgress/>}
				</AppBar>
				<Container fixed>
					<Routes>
						<Route path={'/'} element={<TodoListsList demo={demo}/>}/>
						<Route path={'/login'} element={<Login/>}/>
					</Routes>
				</Container>
			</div>
		</BrowserRouter>
	)
}

export default App
