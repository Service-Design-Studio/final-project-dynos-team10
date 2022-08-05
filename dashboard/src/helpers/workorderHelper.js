import { $axios } from "./axiosHelper";

export const getCompletedWorkorders = async (pageNum=1) => {
    let response = await $axios.get(`workorders/page/${pageNum}?completed=1`);
    console.log(response.data.result);
    return (response.data.result);
}

export const getWorkorder = async (workorderId) => {
    let response = await $axios.get(`workorders/${workorderId}`);
    console.log(response);
    const { id, completed, workorder_number: workorderNumber, user_id: userId, machine_type_id, passed } = response.data.result;
    return { id, completed, workorderNumber, userId, machine_type_id, passed};
}

/**
 * Get the machine type literal name from its id
 * @param {number} machine_type_id 
 * @returns {Promise<string>} type name as a string
 */
export const getMachineType = async(machine_type_id) => {
    let response = await $axios.get(`machine_types/${machine_type_id}`);
    console.log(response);
    return response.data.result.type_name;
}

export const getComponentType = async(component_type_id) => {
    let response = await $axios.get(`component_types/${component_type_id}`);
    console.log(response);
    return response.data.result.type_name;
}

/**
 * gets the components in the DB associated with a certain workorder id
 * @param {number} workorderId workorder id to query
 * @returns {Promise<object>} array of raw results from the DB
 */
export const getWorkorderComponents = async (workorderId) => {
    let response = await $axios.get(`workorders/${workorderId}/components`);
    console.log(response);
    return response.data.result;
}

export const getComponentImages = async (componentId) => {
    let response = await $axios.get(`components/${componentId}/images`);
    console.log(response);
    return response.data.result;
}

/**
 * This function will return a complete workordert, with all its information including components and failing reasons
 * @param {number} workorderId db ID of the workorder
 * @returns {Promise<object>} a promise that resolves to an object of a workorder
 */
export const getFullWorkorder = async (workorderId) => {
    const { id, completed, workorderNumber, userId, machine_type_id, passed } = await getWorkorder(workorderId);
    
    const machineType = await getMachineType(machine_type_id);
    const componentsRaw = await getWorkorderComponents(id);
    const components = await Promise.all(componentsRaw.map(async(el) => ({
        id: el.id,
        status: el.status,
        failingReasons: el.failing_reasons,
        componentType: await getComponentType(el.component_type_id),
        images: await getComponentImages(el.id)
    })))

    const workorder = {
        id,
        completed,
        workorderNumber,
        userId,
        machineType,
        components, 
        passed
    }
    return workorder;
}