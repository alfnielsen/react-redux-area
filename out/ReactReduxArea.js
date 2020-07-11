"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_redux_1 = require("react-redux");
exports.CreateDispatchAction = (dispatch, actionCreator) => {
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
exports.CreateDispatchActions = (dispatch, actionCreatorListObject) => {
    const formattedData = {};
    for (const key of Object.keys(actionCreatorListObject)) {
        const item = actionCreatorListObject[key];
        const dispatchVersion = exports.CreateDispatchAction(dispatch, item);
        formattedData[key] = dispatchVersion;
    }
    return formattedData;
};
exports.useDispatchActions = (actionCreatorListObject) => {
    const dispatch = react_redux_1.useDispatch();
    const memoDispatchActionsObject = react_1.useMemo(() => exports.CreateDispatchActions(dispatch, actionCreatorListObject), [dispatch, actionCreatorListObject]);
    return memoDispatchActionsObject;
};
exports.useAreaHook = (areaActions, selector) => {
    const areaState = react_redux_1.useSelector(selector);
    const dispatchActions = exports.useDispatchActions(areaActions);
    return Object.assign(Object.assign({}, areaState), dispatchActions);
};
//# sourceMappingURL=ReactReduxArea.js.map