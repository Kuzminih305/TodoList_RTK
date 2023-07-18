import {instance, ResponseType} from "common/api/common-api";
import {UpdateDomainTaskModelType} from "features/TodolistsList/tasks-reducer";
import {TaskPriorities, TaskStatuses} from "common/enums";

export const todolistsAPI = {
    getTodolists() {
        return  instance.get<TodolistType[]>('todo-lists');
    },
    createTodolist(title: string) {
        return  instance.post<ResponseType<{ item: TodolistType }>>('todo-lists', {title: title});
    },
    deleteTodolist(arg: DeleteTodoListArgType) {
        return instance.delete<ResponseType>(`todo-lists/${arg.todoListId}`);
    },
    updateTodolist(arg: UpdateTodoListTitleArgType) {
        return instance.put<ResponseType>(`todo-lists/${arg.todoListId}`, {title: arg.title});
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
export type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
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