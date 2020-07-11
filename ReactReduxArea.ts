import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, AnyAction } from 'redux'

export type MethodWithActionName = ((...args: any) => any) & {
   actionName: string
}
export type MapMethodWithActionName<T> = Record<keyof T, MethodWithActionName>

export type DispatchActionObjectMethod<T extends (...args: any) => any> = ((
   ...args: Parameters<T>
) => ReturnType<T>) & {
   actionName: string
}

export type IDispatchActionObject<T extends MapMethodWithActionName<T>> = {
   readonly [K in keyof T]: DispatchActionObjectMethod<T[K]>
}

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }

export const CreateDispatchAction = <T extends MethodWithActionName>(
   dispatch: Dispatch<AnyAction>,
   actionCreator: T
): DispatchActionObjectMethod<T> => {
   const dispatchVersion = ((...args: Parameters<typeof actionCreator>) => {
      const action = actionCreator.apply(null, args)
      dispatch(action)
      return action
   }) as DispatchActionObjectMethod<typeof actionCreator>

   Object.defineProperty(dispatchVersion, 'name', {
      value: actionCreator.name,
      writable: false,
   })
   Object.defineProperty(dispatchVersion, 'actionName', {
      value: dispatchVersion.actionName,
      writable: false,
   })

   return dispatchVersion
}

const CreateDispatchActions = <T extends Record<keyof T, MethodWithActionName>>(
   dispatch: Dispatch,
   actionCreatorListObject: T
): IDispatchActionObject<T> => {
   const formattedData = {} as Mutable<IDispatchActionObject<T>>
   for (const key of Object.keys(actionCreatorListObject) as Array<keyof T>) {
      const item =
         actionCreatorListObject[key as keyof typeof actionCreatorListObject]
      const dispatchVersion = CreateDispatchAction(dispatch, item)
      formattedData[key] = dispatchVersion
   }
   return formattedData
}

export const CreateDispatchActionsObject = <T extends MapMethodWithActionName<T>>(
   actionCreatorListObject: T
) => {
   const dispatch = useDispatch()
   const memoDispatchActionsObject = useMemo(
      () => CreateDispatchActions(dispatch, actionCreatorListObject),
      [dispatch, actionCreatorListObject]
   )
   return memoDispatchActionsObject
}

export const CreateAreaHook = <T extends MapMethodWithActionName<T>, TReduxStoreState, TAreaState>(
   areaActions: T,
   selector: (state: TReduxStoreState) => TAreaState
) => {
   const areaState = useSelector(selector)
   const dispatchActions = CreateDispatchActionsObject(areaActions)
   return {
      ...areaState,
      ...dispatchActions
   }
}

