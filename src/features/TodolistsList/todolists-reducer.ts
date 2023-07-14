import {DeleteTodoListArgType, todolistsAPI, TodolistType, UpdateTodoListTitleArgType} from "api/todolists-api";
import {appActions, RequestStatusType} from "app/app-reducer";
import { handleServerNetworkError } from "utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createAppAsyncThunk} from "utils/create-app-async-thunk";



const slice = createSlice({
  name: 'todoLists',
  initialState: [] as TodolistDomainType[],
  reducers: {
    // deleteTodoList: (state, action: PayloadAction<{ todoListId: string }>) => {
    //   const index = state.findIndex(todo => todo.id === action.payload.todoListId)
    //   if (index !== -1) state.splice(index, 1)
    // },
    // addTodoList: (state, action: PayloadAction<{ todoList: TodolistType }>) => {
    //   const newTodoList = {...action.payload.todoList, filter: 'all', entityStatus: 'idle'} as TodolistDomainType
    //   state.unshift(newTodoList)
    // },
    // updateTodoListTitle: (state, action: PayloadAction<{ todoListId: string, title: string}>) => {
    //   const index = state.findIndex(todo => todo.id === action.payload.todoListId)
    //   if (index !== -1) state[index].title = action.payload.title
    // },
    updateTodoListFilter: (state, action: PayloadAction<{ todoListId: string, filter: FilterValuesType}>) => {
      const index = state.findIndex(todo => todo.id === action.payload.todoListId)
      if (index !== -1) state[index].filter = action.payload.filter
    },
    updateTodoListStatus: (state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType}>) => {
      const index = state.findIndex(todo => todo.id === action.payload.todoListId)
      if (index !== -1) state[index].entityStatus = action.payload.entityStatus
    },
    // setTodoLists: (state, action: PayloadAction<{todoLists: TodolistType[]}>) => {
    //   return action.payload.todoLists.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))
    // }
  },
  extraReducers: (builder) => {
    builder
        .addCase(setTodoList.fulfilled, (state, action) => {
          return action.payload.todoLists.map((tl) => ({...tl, filter: 'all', entityStatus: 'idle'}))
        })
        .addCase(deleteTodoList.fulfilled, (state, action) => {
          const index = state.findIndex(todo => todo.id === action.payload.todoListId)
          if (index !== -1) state.splice(index, 1)
        })
        .addCase(addTodoList.fulfilled, (state, action) => {
          const newTodoList = {...action.payload.todoList, filter: 'all', entityStatus: 'idle'} as TodolistDomainType
          state.unshift(newTodoList)
        })
        .addCase(changeTodolistTitle.fulfilled, (state, action) => {
          const index = state.findIndex(todo => todo.id === action.payload.todoListId)
          if (index !== -1) state[index].title = action.payload.title
        })
  }
})


// thunks
const setTodoList = createAppAsyncThunk<
    {todoLists: TodolistType[]}
>('todoList/setTodoList', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(appActions.setStatus({status: "loading" }));
   const res = await todolistsAPI.getTodolists()
          dispatch(appActions.setStatus({status: "succeeded" }));
          return {todoLists: res.data}
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})

// export const setTodoListsTC = (): AppThunk => {
//   return (dispatch) => {
//     dispatch(appActions.setStatus({status: "loading" }));
//     todolistsAPI
//       .getTodolists()
//       .then((res) => {
//         dispatch(todoListsActions.setTodoLists({todoLists: res.data}));
//         dispatch(appActions.setStatus({status: "succeeded" }));
//       })
//       .catch((error) => {
//         handleServerNetworkError(error, dispatch);
//       });
//   };
// };

const deleteTodoList = createAppAsyncThunk<
    DeleteTodoListArgType,
    DeleteTodoListArgType
>('todoList/deleteTodoList', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(appActions.setStatus({status: "loading"}));
    dispatch(todoListsActions.updateTodoListStatus({todoListId: arg.todoListId, entityStatus: "loading"}));
    const res = await todolistsAPI.deleteTodolist(arg)
      dispatch(appActions.setStatus({status: "succeeded"}));
      return arg;
  } catch (e) {
    dispatch(todoListsActions.updateTodoListStatus({todoListId: arg.todoListId, entityStatus: "succeeded"}));
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})
// export const removeTodolistTC = (todolistId: string): AppThunk => {
//   return (dispatch) => {
//     //изменим глобальный статус приложения, чтобы вверху полоса побежала
//     dispatch(appActions.setStatus({status: "loading" }));
//     //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//     dispatch(todoListsActions.updateTodoListStatus({todoListId: todolistId, entityStatus: "loading"}));
//     todolistsAPI.deleteTodolist(todolistId).then(() => {
//       dispatch(todoListsActions.deleteTodoList({todoListId: todolistId}));
//       //скажем глобально приложению, что асинхронная операция завершена
//       dispatch(appActions.setStatus({status: "succeeded" }));
//     });
//   };
// };
const addTodoList = createAppAsyncThunk<
    { todoList: TodolistType },
    { title: string }
>('todoList/addTodoList', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    dispatch(appActions.setStatus({status: "loading"}));
    const res = await todolistsAPI.createTodolist(arg.title)
    dispatch(appActions.setStatus({status: "succeeded"}));
    return {todoList: res.data.data.item};
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})
// export const addTodolistTC = (title: string): AppThunk => {
//   return (dispatch) => {
//     dispatch(appActions.setStatus({status: "loading" }));
//     todolistsAPI.createTodolist(title).then((res) => {
//       dispatch(todoListsActions.addTodoList({todoList: res.data.data.item}));
//       dispatch(appActions.setStatus({status: "succeeded" }));
//     });
//   };
// };

const changeTodolistTitle = createAppAsyncThunk<
    UpdateTodoListTitleArgType,
    UpdateTodoListTitleArgType
>('todoList/changeTodolistTitle', async (arg, thunkAPI) => {
  const {dispatch, rejectWithValue} = thunkAPI
  try {
    const res = await todolistsAPI.updateTodolist(arg)
    return arg;
  } catch (e) {
    handleServerNetworkError(e, dispatch)
    return rejectWithValue(null)
  }
})
// export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
//   return (dispatch) => {
//     todolistsAPI.updateTodolist(id, title).then(() => {
//       dispatch(todoListsActions.updateTodoListTitle({todoListId: id, title}));
//     });
//   };
// };
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
export const todoListsReducer = slice.reducer
export const todoListsActions = slice.actions
export const todoListsThunks = {setTodoList, deleteTodoList, addTodoList, changeTodolistTitle}

