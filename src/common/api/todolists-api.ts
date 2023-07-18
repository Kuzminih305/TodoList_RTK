import axios from 'axios'
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '1cdd9f77-c60e-4af5-b194-659e4ebd5d41'
    }
}
export const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1/',
    ...settings
})

// api
export const todolistsAPI = {
    getTodolists() {
        const promise = instance.get<TodolistType[]>('todo-lists');
        return promise;
    },
    createTodolist(title: string) {
        const promise = instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
        return promise;
    },
    deleteTodolist(arg: DeleteTodoListArgType) {
        const promise = instance.delete<ResponseType>(`todo-lists/${arg.todoListId}`);
        return promise;
    },
    updateTodolist(arg: UpdateTodoListTitleArgType) {
        const promise = instance.put<ResponseType>(`todo-lists/${arg.todoListId}`, {title: arg.title});
        return promise;
    },
    getTasks(todolistId: string) {
        return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
    },
    deleteTask(arg: DeleteTaskArgType) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todoListId}/tasks/${arg.taskId}`);
    },
    createTask(arg: AddTaskArgType) {
        return instance.post<ResponseType<{ item: TaskType}>>(`todo-lists/${arg.todolistId}/tasks`, {title: arg.title});
    },
    updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
    }
}






// types
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}
export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    data: D
}
export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}
export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
}
export type TaskType = {
    description: string
    title: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}
export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}
type GetTasksResponse = {
    error: string | null
    totalCount: number
    items: TaskType[]
}

export type AddTaskArgType = {title: string; todolistId: string}
export type UpdateTaskArgType = {taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string }
export type DeleteTaskArgType = {taskId: string, todoListId: string }
export type DeleteTodoListArgType = {todoListId: string}
export type UpdateTodoListTitleArgType = {todoListId: string, title: string}