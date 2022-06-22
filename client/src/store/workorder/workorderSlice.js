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
        addNewComponent: (state, action) => {
            const componentName = action.payload;
            if (componentName in state.components) {
                return;
            }

            state.components[componentName] = {
                images: [],
                status: 'incomplete'
            }
        },
        addImageToComponent: (state, action) => {
            // action.payload is an object expecting some options that are of the Component "type"
            const { componentName, image } = action.payload;
            state.components[componentName].images.push(image);
        },
        updateCurrentComponentName: (state, action) => {
            state.currentComponentName = action.payload;
        }
    }
})

// ACTIONS/SETTERRS/MUTATORS
export const { addNewComponent, addImageToComponent, updateCurrentComponentName } = workorderSlice.actions;

// GETTERS
export const selectWorkorderNumber = (state) => state.workorder.workorderNumber;
export const selectWorkorderComponents = (state) => state.workorder.components;
export const selectCurrentComponentName = (state) => state.workorder.currentComponentName;
export const selectCurrentComponent = state => state.workorder.components[state.workorder.currentComponentName];

export default workorderSlice.reducer;