type FieldErrorType = {
    error: string
    field: string
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: string[]
    data: D
    fieldsErrors: FieldErrorType[]
}
export type UserDataType = {
    id: number,
    email: string,
    login: string
}
