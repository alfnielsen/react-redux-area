"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const CreateDispatchAction = (dispatch, actionCreator) => {
    const dispatchVersion = ((...args) => {
        const action = actionCreator.apply(null, args);
        dispatch(action);
        return action;
    });
    Object.defineProperty(dispatchVersion, 'name', {
        value: actionCreator.name,
        writable: false,
    });
    Object.defineProperty(dispatchVersion, 'actionName', {
        value: dispatchVersion.actionName,
        writable: false,
    });
    return dispatchVersion;
};
exports.CreateDispatchAction = CreateDispatchAction;
const CreateDispatchActions = (dispatch, actionCreatorListObject) => {
    const formattedData = {};
    for (const key of Object.keys(actionCreatorListObject)) {
        const item = actionCreatorListObject[key];
        const dispatchVersion = CreateDispatchAction(dispatch, item);
        formattedData[key] = dispatchVersion;
    }
    return formattedData;
};
exports.CreateDispatchActions = CreateDispatchActions;
const useDispatchActions = (actionCreatorListObject) => {
    const dispatch = react_redux_1.useDispatch();
    const memoDispatchActionsObject = react_1.useMemo(() => CreateDispatchActions(dispatch, actionCreatorListObject), [dispatch, actionCreatorListObject]);
    return memoDispatchActionsObject;
};
exports.useDispatchActions = useDispatchActions;
const useAreaHook = (areaActions, selector) => {
    const areaState = react_redux_1.useSelector(selector);
    const dispatchActions = useDispatchActions(areaActions);
    return Object.assign(Object.assign({}, areaState), dispatchActions);
};
exports.useAreaHook = useAreaHook;
//# sourceMappingURL=ReactReduxArea.js.map