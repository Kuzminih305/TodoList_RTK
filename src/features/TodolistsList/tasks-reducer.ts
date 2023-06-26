import {todoListsActions} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType,} from "api/todolists-api";
import {AppThunk} from "app/store";
import {handleServerAppError, handleServerNetworkError} from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "app/app-reducer";


const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        deleteTask: (state, action: PayloadAction<{todoListId: string, taskId: string}>) => {
            let tasksForTodoList = state[action.payload.todoListId]
            const index = tasksForTodoList.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) tasksForTodoList.splice(index,1)
        },
        addTask: (state, action: PayloadAction<{task: TaskType}>) => {
            let tasksForTodoList = state[action.payload.task.todoListId]
            tasksForTodoList.unshift(action.payload.task)
        },
        updateTask: (state, action: PayloadAction<{ todolistId: string ,taskId: string, model: UpdateDomainTaskModelType}>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex((task) => task.id === action.payload.taskId)
            if (index !== -1) tasks[index] = {...tasks[index], ...action.payload.model}
        },
        setTasks: (state, action: PayloadAction<{todolistId: string, tasks: TaskType[]}>) => {
            state[action.payload.todolistId] = action.payload.tasks
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(todoListsActions.addTodoList, (state, action) => {
                state[action.payload.todoList.id] = []
            })
            .addCase(todoListsActions.deleteTodoList, (state, action) => {
                delete state[action.payload.todoListId]
            })
            .addCase(todoListsActions.setTodoLists, (state, action) => {
                action.payload.todoLists.forEach((tl) => {
                    state[tl.id] = []
                })
            })
    }
})
export const tasksReducer = slice.reducer
export const tasksActions = slice.actions

// thunks
export const fetchTasksTC =
    (todolistId: string): AppThunk =>
        (dispatch) => {
            dispatch(appActions.setStatus({status: "loading" }));
            todolistsAPI.getTasks(todolistId).then((res) => {
                dispatch(tasksActions.setTasks({tasks: res.data.items, todolistId}));
                dispatch(appActions.setStatus({status: "succeeded" }));
            });
        };
export const removeTaskTC =
    (taskId: string, todolistId: string): AppThunk => (dispatch) => {
        todolistsAPI.deleteTask(todolistId, taskId).then(() => {
            dispatch(tasksActions.deleteTask({taskId, todoListId: todolistId}));
        });
    };
export const addTaskTC =
    (title: string, todolistId: string): AppThunk =>
        (dispatch) => {
            dispatch(appActions.setStatus({status: "loading" }));
            todolistsAPI
                .createTask(todolistId, title)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(tasksActions.addTask({task: res.data.data.item}));
                        dispatch(appActions.setStatus({status: "succeeded" }));
                    } else {
                        handleServerAppError(res.data, dispatch);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                });
        };
export const updateTaskTC =
    (
        taskId: string,
        domainModel: UpdateDomainTaskModelType,
        todolistId: string
    ): AppThunk =>
        (dispatch, getState) => {
            const state = getState();
            const task = state.tasks[todolistId].find((t) => t.id === taskId);
            if (!task) {
                //throw new Error("task not found in the state");
                console.warn("task not found in the state");
                return;
            }

            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel,
            };

            todolistsAPI
                .updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === 0) {
                        dispatch(tasksActions.updateTask({taskId, todolistId, model: apiModel}));
                    } else {
                        handleServerAppError(res.data, dispatch);
                    }
                })
                .catch((error) => {
                    handleServerNetworkError(error, dispatch);
                });
        };

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
