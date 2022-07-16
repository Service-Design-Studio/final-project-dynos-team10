import { createSlice } from "@reduxjs/toolkit";

// A component should look like this:
// label: {
//     images: [],
//     status: pass/fail/incomplete
//     failingReasons: []
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
                status: 'blue',
                failingReasons: []
            }
        },
        addImageToComponent: (state, action) => {
            // action.payload is an object expecting some options that are of the Component "type"
            const { componentName, image } = action.payload;
            state.components[componentName].images.push(image);
        },
        addImagesArrayToComponent: (state, action) => {
            const { componentName, images } = action.payload;
            state.components[componentName].images = images;
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
        },
        updateComponentStatus: (state, action) => {
            const { componentName, status } = action.payload;
            state.components[componentName].status = status;
        },
        replaceCurrentComponentImageArray: (state, action) => {
            state.components[state.currentComponentName].images = action.payload;
        },
        addFailingReasons: (state, action) => {
            const componentName = action.payload.componentName;
            const failingReasons = action.payload.failingReasons;
            console.log("component name = " + componentName);
            console.log("action payload = " + failingReasons);
            console.log(state.components[componentName].failingReasons);
            state.components[componentName].failingReasons = failingReasons;
        },
        resetWorkorderValues: (state, action) => {
            state.components = {};
            state.workorderNumber = '';
            state.currentComponentName = '';
        },
        startNewWorkorder: (state, action) => {
            state.components = {};
            state.workorderNumber = action.payload;
            state.currentComponentName = '';
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
    replaceCurrentComponentImageArray,
    addFailingReasons,
    resetWorkorderValues,
    startNewWorkorder,
    addImagesArrayToComponent,
    updateComponentStatus
} = workorderSlice.actions;

// GETTERS
export const selectWorkorderNumber = (state) => state.workorder.workorderNumber;
export const selectWorkorderComponents = (state) => state.workorder.components;
export const selectCurrentComponentName = (state) => state.workorder.currentComponentName;
export const selectCurrentComponent = state => state.workorder.components[state.workorder.currentComponentName];
export const selectComponentByName = componentName => state => state.workorder.components[componentName];

export default workorderSlice.reducer;