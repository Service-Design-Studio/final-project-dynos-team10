export const KEY = "redux";

/**
 * loads the serialised redux store state from local storage
 * @returns 
 */
export function loadState() {
    try {
        const serializedState = localStorage.getItem(KEY);
        return !serializedState ? undefined : JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
}

export function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(KEY, serializedState);
    } catch (e) {

    }
}