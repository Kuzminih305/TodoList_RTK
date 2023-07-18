import React, { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { AppRootStateType } from 'app/store'
import {
    FilterValuesType,
    TodolistDomainType, todoListsActions, todoListsThunks
} from './todolists-reducer'
import { TasksStateType, tasksThunks} from './tasks-reducer'
import { Grid, Paper } from '@mui/material'
import { AddItemForm } from 'common/components/AddItemForm/AddItemForm'
import { Todolist } from './Todolist/Todolist'
import { Navigate } from 'react-router-dom'
import { useAppDispatch } from 'common/hooks/useAppDispatch';
import {TaskStatuses} from "common/enums";

type PropsType = {
    demo?: boolean
}

export const TodoListsList: React.FC<PropsType> = ({demo = false}) => {
    const todoLists = useSelector<AppRootStateType, Array<TodolistDomainType>>(state => state.todoLists)
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        const thunk = todoListsThunks.setTodoList()
			dispatch(thunk)
    }, [])

    const removeTask = useCallback(function (id: string, todoListId: string) {
        dispatch(tasksThunks.deleteTask({taskId: id, todoListId}))
    }, [])

    const addTask = useCallback(function (title: string, todolistId: string) {
        dispatch(tasksThunks.addTask({todolistId, title}))
    }, [])

    const changeStatus = useCallback(function (id: string, status: TaskStatuses, todolistId: string) {
        dispatch(tasksThunks.updateTask({taskId: id, todolistId, domainModel: {status}}))
    }, [])

    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todolistId: string) {
        dispatch(tasksThunks.updateTask({taskId: id, todolistId, domainModel: {title: newTitle}}))
    }, [])

    const changeFilter = useCallback(function (value: FilterValuesType, todolistId: string) {
        dispatch(todoListsActions.updateTodoListFilter({todoListId: todolistId, filter: value}))
    }, [])

    const removeTodolist = useCallback(function (id: string) {
        dispatch(todoListsThunks.deleteTodoList({todoListId: id}))
    }, [])

    const changeTodolistTitle = useCallback(function (id: string, title: string) {
        dispatch(todoListsThunks.changeTodolistTitle({todoListId: id, title}))
    }, [])

    const addTodolist = useCallback((title: string) => {
        dispatch(todoListsThunks.addTodoList({title}))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Navigate to={"/login"} />
    }

    return <>
        <Grid container style={{padding: '20px'}}>
            <AddItemForm addItem={addTodolist}/>
        </Grid>
        <Grid container spacing={3}>
            {
                todoLists.map(tl => {
                    let allTodolistTasks = tasks[tl.id]

                    return <Grid item key={tl.id}>
                        <Paper style={{padding: '10px'}}>
                            <Todolist
                                todolist={tl}
                                tasks={allTodolistTasks}
                                removeTask={removeTask}
                                changeFilter={changeFilter}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                removeTodolist={removeTodolist}
                                changeTaskTitle={changeTaskTitle}
                                changeTodolistTitle={changeTodolistTitle}
                                demo={demo}
                            />
                        </Paper>
                    </Grid>
                })
            }
        </Grid>
    </>
}
