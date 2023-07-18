import { todoListsThunks} from "./todolists-reducer";
import {createSlice} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";
import {createAppAsyncThunk, handleServerAppError, handleServerNetworkError} from "common/utils";
import {
    AddTaskArgType,
    DeleteTaskArgType,
    TaskType,
    todolistsAPI,
    UpdateTaskArgType, UpdateTaskModelType
} from "features/TodolistsList/todolists-api";
import {TaskPriorities, TaskStatuses} from "common/enums";



const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        // deleteTask: (state, action: PayloadAction<{todoListId: string, taskId: string}>) => {
        //     let tasksForTodoList = state[action.payload.todoListId]
        //     const index = tasksForTodoList.findIndex((task) => task.id === action.payload.taskId)
        //     if (index !== -1) tasksForTodoList.splice(index,1)
        // },
        // addTask: (state, action: PayloadAction<{task: TaskType}>) => {
        //     let tasksForTodoList = state[action.payload.task.todoListId]
        //     tasksForTodoList.unshift(action.payload.task)
        // },
        // updateTask: (state, action: PayloadAction<{ todolistId: string ,taskId: string, model: UpdateDomainTaskModelType}>) => {
        //     const tasks = state[action.payload.todolistId]
        //     const index = tasks.findIndex((task) => task.id === action.payload.taskId)
        //     if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
        // },
    },
    extraReducers: (builder) => {
        builder
            .addCase(deleteTask.fulfilled, (state, action) => {
                let tasksForTodoList = state[action.payload.todoListId]
                const index = tasksForTodoList.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) tasksForTodoList.splice(index,1)
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex((task) => task.id === action.payload.taskId)
                if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.domainModel}
            })
            .addCase(addTask.fulfilled, (state, action) => {
                let tasksForTodoList = state[action.payload.task.todoListId]
                tasksForTodoList.unshift(action.payload.task)
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(todoListsThunks.addTodoList.fulfilled, (state, action) => {
                state[action.payload.todoList.id] = []
            })
            .addCase(todoListsThunks.deleteTodoList.fulfilled, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(todoListsThunks.setTodoList.fulfilled, (state, action) => {
                action.payload.todoLists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
    }
})


// thunks


const fetchTasks = createAppAsyncThunk<
    { tasks: TaskType[], todolistId: string },
    string
>('tasks/fetchTasksTC', async (todolistId, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setStatus({status: "loading"}));
        const res = await todolistsAPI.getTasks(todolistId)
        dispatch(appActions.setStatus({status: "succeeded"}));
        return {tasks: res.data.items, todolistId};
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

const deleteTask = createAppAsyncThunk<
    DeleteTaskArgType,
    DeleteTaskArgType
>('task/deleteTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue} = thunkAPI
    try {
        dispatch(appActions.setStatus({status: "loading"}));
        const res = await todolistsAPI.deleteTask(arg)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setStatus({status: "succeeded"}));
            return arg
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// export const removeTaskTC =
//     (taskId: string, todolistId: string): AppThunk => (dispatch) => {
//         todolistsAPI.deleteTask(todolistId, taskId).then(() => {
//             dispatch(tasksActions.deleteTask({taskId, todoListId: todolistId}));
//         });
//     };


const addTask = createAppAsyncThunk<
    {task: TaskType},
    AddTaskArgType
>('tasks/addTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue } = thunkAPI
    try {
        dispatch(appActions.setStatus({status: "loading" }));
        const res = await todolistsAPI.createTask(arg)
                if (res.data.resultCode === 0) {
                    dispatch(appActions.setStatus({status: "succeeded" }));
                    return {task: res.data.data.item}
                } else {
                    handleServerAppError(res.data, dispatch);
                    return rejectWithValue(null)
                }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// export const addTaskTC =
//     (title: string, todolistId: string): AppThunk =>
//         (dispatch) => {
//             dispatch(appActions.setStatus({status: "loading" }));
//             todolistsAPI
//                 .createTask(todolistId, title)
//                 .then((res) => {
//                     if (res.data.resultCode === 0) {
//                         dispatch(tasksActions.addTask({task: res.data.data.item}));
//                         dispatch(appActions.setStatus({status: "succeeded" }));
//                     } else {
//                         handleServerAppError(res.data, dispatch);
//                     }
//                 })
//                 .catch((error) => {
//                     handleServerNetworkError(error, dispatch);
//                 });
//         };

const updateTask = createAppAsyncThunk<
    UpdateTaskArgType,
    UpdateTaskArgType
>('task/updateTask', async (arg, thunkAPI) => {
    const {dispatch, rejectWithValue, getState} = thunkAPI
    try {
        const state = getState();
        const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn("task not found in the state");
            return rejectWithValue(null)
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...arg.domainModel,
        };
        const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel)
        if (res.data.resultCode === 0) {
            dispatch(appActions.setStatus({status: 'succeeded'}))
            return arg;
        } else {
            handleServerAppError(res.data, dispatch);
            return rejectWithValue(null)
        }
    } catch (e) {
        handleServerNetworkError(e, dispatch)
        return rejectWithValue(null)
    }
})

// export const _updateTaskTC =
//     (
//         taskId: string,
//         domainModel: UpdateDomainTaskModelType,
//         todolistId: string
//     ): AppThunk =>
//         (dispatch, getState) => {
//             const state = getState();
//             const task = state.tasks[todolistId].find((t) => t.id === taskId);
//             if (!task) {
//                 //throw new Error("task not found in the state");
//                 console.warn("task not found in the state");
//                 return;
//             }
//
//             const apiModel: UpdateTaskModelType = {
//                 deadline: task.deadline,
//                 description: task.description,
//                 priority: task.priority,
//                 startDate: task.startDate,
//                 title: task.title,
//                 status: task.status,
//                 ...domainModel,
//             };
//
//             todolistsAPI
//                 .updateTask(todolistId, taskId, apiModel)
//                 .then((res) => {
//                     if (res.data.resultCode === 0) {
//                         dispatch(tasksActions.updateTask({taskId, todolistId, model: apiModel}));
//                     } else {
//                         handleServerAppError(res.data, dispatch);
//                     }
//                 })
//                 .catch((error) => {
//                     handleServerNetworkError(error, dispatch);
//                 });
//         };

// types
export type UpdateDomainTaskModelType = {
    title?: string;
    description?: string;
    status?: TaskStatuses;
    priority?: TaskPriorities;
    startDate?: string;
    deadline?: string;
};
export type TasksStateType = {
    [key: string]: Array<TaskType>;
};
export const tasksReducer = slice.reducer
export const tasksThunks = { fetchTasksTC: fetchTasks, addTask, updateTask, deleteTask }
