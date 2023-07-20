import {instance} from "common/api/common-api";
import {ResponseType} from "common/types/common-types"
import {
    AddTaskArgType, DeleteTaskArgType,
    DeleteTodoListArgType, GetTasksResponse, TaskType,
    TodolistType, UpdateTaskModelType,
    UpdateTodoListTitleArgType
} from "features/TodolistsList/todoLists-types";

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
