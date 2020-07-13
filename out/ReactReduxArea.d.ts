import { AnyAction, Dispatch } from 'redux';
export declare type MethodWithActionName = ((...args: any) => any) & {
    actionName: string;
};
export declare type MapMethodWithActionName<T> = Record<keyof T, MethodWithActionName>;
export declare type DispatchActionObjectMethod<T extends (...args: any) => any> = ((...args: Parameters<T>) => ReturnType<T>) & {
    actionName: string;
};
export declare type IDispatchActionObject<T extends MapMethodWithActionName<T>> = {
    readonly [K in keyof T]: DispatchActionObjectMethod<T[K]>;
};
export declare type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
declare const CreateDispatchAction: <T extends MethodWithActionName>(dispatch: Dispatch<AnyAction>, actionCreator: T) => DispatchActionObjectMethod<T>;
declare const CreateDispatchActions: <T extends Record<keyof T, MethodWithActionName>>(dispatch: Dispatch<AnyAction>, actionCreatorListObject: T) => IDispatchActionObject<T>;
declare const useDispatchActions: <T extends Record<keyof T, MethodWithActionName>>(actionCreatorListObject: T) => IDispatchActionObject<T>;
declare const useAreaHook: <T extends Record<keyof T, MethodWithActionName>, TReduxStoreState, TAreaState>(areaActions: T, selector: (state: TReduxStoreState) => TAreaState) => TAreaState & IDispatchActionObject<T>;
export { CreateDispatchAction, CreateDispatchActions, useDispatchActions, useAreaHook };
