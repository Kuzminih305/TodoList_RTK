import {ResponseType} from "common/types/common-types"
import {Dispatch} from "redux";
import {appActions} from "app/app-reducer";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(appActions.setError({ error: data.messages[0]}))
    } else {
        dispatch(appActions.setError({ error: 'Some error occurred'}))
    }
    dispatch(appActions.setStatus({status: 'failed'}))
}