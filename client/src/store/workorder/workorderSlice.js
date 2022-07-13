import { createSlice } from "@reduxjs/toolkit";

// A component should look like this:
// label: {
//     images: [],
//     status: pass/fail/incomplete
// }

const initialState = {
    workorderNumber: '',
    components: {},
    currentComponentName: ''
}

export const workorderSlice = createSlice({
    name: 'workorder',
    initialState,
    reducers: {
        setWorkorderNumber: (state, action) => {
            state.workorderNumber = action.payload;
        },
        addNewComponent: (state, action) => {
            const componentName = action.payload;
            if (componentName in state.components) {
                return;
            }

            state.components[componentName] = {
                images: [],
                status: 'blue'
            }
        },
        addImageToComponent: (state, action) => {
            // action.payload is an object expecting some options that are of the Component "type"
            const { componentName, image } = action.payload;
            state.components[componentName].images.push(image);
        },
        removeComponentImageByIndex: (state, action) => {
            const { componentName, index } = action.payload;
            state.components[componentName].images.splice(index, 1);
        },
        updateCurrentComponentName: (state, action) => {
            state.currentComponentName = action.payload;
        },
        updateCurrentComponentStatus: (state, action) => {
            state.components[state.currentComponentName].status = action.payload;
            console.log("component name = " + state.currentComponentName);
            console.log("component status = " + state.components[state.currentComponentName].status);
        },
        replaceCurrentComponentImageArray: (state, action) => {
            console.log("current component name = " + state.currentComponentName);
            console.log("action payload = " + action.payload);
            state.components[state.currentComponentName].images = action.payload;

        }
    }
})

// ACTIONS/SETTERRS/MUTATORS
export const { 
    setWorkorderNumber,
    addNewComponent,
    addImageToComponent,
    updateCurrentComponentName,
    removeComponentImageByIndex,
    updateCurrentComponentStatus,
    replaceCurrentComponentImageArray
} = workorderSlice.actions;

// GETTERS
export const selectWorkorderNumber = (state) => state.workorder.workorderNumber;
export const selectWorkorderComponents = (state) => state.workorder.components;
export const selectCurrentComponentName = (state) => state.workorder.currentComponentName;
export const selectCurrentComponent = state => state.workorder.components[state.workorder.currentComponentName];

export default workorderSlice.reducer;