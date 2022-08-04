import { createSlice } from "@reduxjs/toolkit";

// ------- old interfaces ----------
/*
interface Component {
    images: Image[],
    status: 'green' | 'red' | 'yellow' | 'blue'
    failingReasons: string[],
    id: number | null, // null to indicate this has not yet been in the DB
    componentTypeId: number
}

interface Image {
    id: number | null,
    src: string
}
*/

// ------- new interfaces ----------
/*
interface Component {
    images: Image[],
    status: 'green' | 'red' | 'yellow' | 'blue'
    failingReasons: FailingReason[], // this is for actual instances of failing reasons for a component, not for component types
    id: number | null, // null to indicate this has not yet been in the DB
    componentTypeId: number
}

interface FailingReason {
    failingReasonTypeId: number,
    failingReasonName: string
}
*/

const initialState = {
    workorderNumber: '',
    components: {}, // {[componentName: string]: Component}
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
            const { type_name: componentName, id: componentTypeId } = action.payload;
            if (componentName in state.components) {
                return;
            }

            state.components[componentName] = {
                images: [],
                status: 'blue',
                failingReasons: [],
                id: null,
                componentTypeId
            }
        },
        updateComponentId: (state, action) => {
            const { componentName, id } = action.payload;
            if (!(componentName in state.components)) {
                return;
            }
            state.components[componentName].id = id;
        },
        addImageToComponent: (state, action) => {
            const { componentName, image } = action.payload;
            const newImage = {
                id: null,
                src: image
            }
            state.components[componentName].images.push(newImage);
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
        },
        putOrAddComponent: (state, action) => {
            const { componentName, images, status, failingReasons, id, componentTypeId } = action.payload;
            state.components[componentName] = {
                images,
                status,
                failingReasons,
                id,
                componentTypeId
            }
        }
    }
})

// ACTIONS/SETTERRS/MUTATORS
export const { 
    setWorkorderNumber,
    addNewComponent,
    updateComponentId,
    addImageToComponent,
    updateCurrentComponentName,
    removeComponentImageByIndex,
    updateCurrentComponentStatus,
    replaceCurrentComponentImageArray,
    addFailingReasons,
    resetWorkorderValues,
    startNewWorkorder,
    addImagesArrayToComponent,
    updateComponentStatus,
    putOrAddComponent
} = workorderSlice.actions;

// GETTERS
export const selectWorkorderNumber = (state) => state.workorder.workorderNumber;
export const selectWorkorderComponents = (state) => state.workorder.components;
export const selectCurrentComponentName = (state) => state.workorder.currentComponentName;
export const selectCurrentComponent = state => state.workorder.components[state.workorder.currentComponentName];
export const selectComponentByName = componentName => state => state.workorder.components[componentName];

export default workorderSlice.reducer;