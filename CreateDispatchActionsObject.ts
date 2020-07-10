import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'

export type MethodWithActionName = ((...args: any) => any) & {
  actionName: string
}
type MapMethodWithActionName<T> = Record<keyof T, MethodWithActionName>

type DispatchActionObjectMethod<T extends (...args: any) => any> = ((
  ...args: Parameters<T>
) => ReturnType<T>) & {
  actionName: string
}

type IDispatchActionObject<T extends MapMethodWithActionName<T>> = {
  readonly [K in keyof T]: DispatchActionObjectMethod<T[K]>
}
type Mutable<T> = { -readonly [K in keyof T]: T[K] }

const CreateDispatchActions = <T extends Record<keyof T, MethodWithActionName>>(
  dispatch: Dispatch,
  actionCreatorListObject: T
): IDispatchActionObject<T> => {
  const formattedData = {} as Mutable<IDispatchActionObject<T>>
  for (const key of Object.keys(actionCreatorListObject) as Array<keyof T>) {
    const item =
      actionCreatorListObject[key as keyof typeof actionCreatorListObject]
    const dispatchVersion = ((...args: Parameters<typeof item>) => {
      const action = item.apply(null, args)
      dispatch(action)
      return action
    }) as DispatchActionObjectMethod<typeof item>

    Object.defineProperty(dispatchVersion, 'name', {
      value: item.name,
      writable: false,
    })
    Object.defineProperty(dispatchVersion, 'actionName', {
      value: item.actionName,
      writable: false,
    })

    formattedData[key] = dispatchVersion
  }
  return formattedData
}

const CreateDispatchActionsObject = <T extends MapMethodWithActionName<T>>(
  actionCreatorListObject: T
) => {
  const dispatch = useDispatch()
  const memoDispatchActionsObject = useMemo(
    () => CreateDispatchActions(dispatch, actionCreatorListObject),
    [dispatch, actionCreatorListObject]
  )
  return memoDispatchActionsObject
}

export default CreateDispatchActionsObject
