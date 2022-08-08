const { BigQuery } = require('@google-cloud/bigquery');
const bigquery = new BigQuery();
const DATASET_ID = 'workorders_dataset';
const TABLE_ID  = process.env.BQ_TABLE_ID;

const Knex = require('knex');
const createUnixSocketPool = async(config) => {
    return Knex({
        client: 'pg',
        connection: {
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            host: process.env.INSTANCE_UNIX_SOCKET
        },
        ...config
    })
}
const checkTables = async pool => {
    const hasTables = await pool.schema.hasTable('workorders');
    if (!hasTables) {
        throw 'could not find required tables!';
    }
    console.log('tables found');
}

// ------------ QUERYING CLOUD SQL ------------------
// http://knexjs.org/guide/query-builder.html
const getAllWorkorders = async pool => {
    return await pool.select().from('workorders');
}
const getWorkorder = async (pool, id) => {
    return await pool('workorders').where('id', id).select('id', 'workorder_number', 'user_id', 'machine_type_id', 'passed').limit(1);
}
const getMachineType = async (pool, machineTypeId) => {
    return await pool('machine_types').where('id', machineTypeId).select('id', 'type_name').limit(1);
}
const getComponents = async (pool, workorderId) => {
    const records = await pool('components').where('workorder_id', workorderId).select('id', 'status', 'component_type_id');
    for (let i = 0; i < records.length; i++) {
        const componentTypeId = +records[i].component_type_id;
        records[i].component_type_name = (await pool('component_types').where('id', componentTypeId).select('type_name').limit(1))[0].type_name;
    }
    return records
}
const getComponentFailingReasons = async (pool, componentId) => {
    let failing_reasons_type_ids = await pool('components_failing_reasons_types').where('component_id', componentId).select('failing_reasons_type_id');
    failing_reasons_type_ids = failing_reasons_type_ids.map(el => +el.failing_reasons_type_id);
    // console.log({failing_reasons_type_ids});
    return await pool('failing_reasons_types').whereIn('id', failing_reasons_type_ids).select('id', 'reason');
} 
// --------------------------------------------------

const getTransformedFailingReasons = async (pool, componentIds) => {
    // for now, failingReasons is string[][], but will eventually be FailingReason[][] as its own model
    // might not be the most efficient way to count occurences
    const occurenceMap = {};
    for (const componentId of componentIds) {
        const componentFailingReasons = await getComponentFailingReasons(pool, componentId);
        console.log({componentFailingReasons});
        componentFailingReasons.forEach(failingReason => {
            const id = +failingReason.id;
            let updatedObj;
            if (id in occurenceMap) {
                updatedObj = {
                    reason: failingReason.reason,
                    number: occurenceMap[id].number + 1
                }
            } else {
                updatedObj = {
                    reason: failingReason.reason,
                    number: 1
                }
            }
            occurenceMap[id] = updatedObj;
        })
    }
    const transformed = [];
    for (const [failingReasonId, occurence] of Object.entries(occurenceMap)) {
        transformed.push({
            id: failingReasonId,
            name: occurence.reason,
            occurences: occurence.number
        })
    }
    return transformed;
}

/**
 * Cloud Function to be triggered by Pub/Sub, whenever the a message is pushed to the configured topic
 * Use for event-driven ETL to write to BigQuery
 * @param {object} message The Pub/Sub message.
 * @param {object} context The event metadata.
 */
exports.workordersEtl = async (message, context) => {
    if (!message.data) {
        console.log('Could not read pubsub message data');
        return;
    }

    const data = JSON.parse(Buffer.from(message.data, 'base64').toString());
    let workorderId;
    if (!data.id) {
        throw 'Missing required workorder id in the pubsub message body';
    }
    workorderId = parseInt(data.id, 10);
    try {
        // --------- EXTRACT ------------
        const pool = await createUnixSocketPool();
        await checkTables(pool);
        
        const workorder = await getWorkorder(pool, workorderId);
        console.log({workorder: workorder[0]});
        const { id: workorder_id, workorder_number, user_id, machine_type_id, passed } = workorder[0];

        // validate if there are duplicate entries (what about updating???)
        const sqlQuery = `
            SELECT *
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE workorder_id = @id
        `
        const options = {
            query: sqlQuery,
            location: 'asia-southeast1',
            params: { id: parseInt(workorder_id, 10) }
        }
        const response = await bigquery.query(options);
        if (response[0].length > 0) {
            console.log('existing record found');
            return;
        }

        const { type_name: machine_type_name } = (await getMachineType(pool, machine_type_id))[0];
        const components = await getComponents(pool, workorder_id);
        const processedFailingReasons = await getTransformedFailingReasons(pool, components.map(el => el.id));
        
        // ----------- TRANSFORM ---------------
        const rowData = {
            workorder_id,
            workorder_number,
            user_id,
            machine_type_id,
            machine_type_name,
            passed,
            failing_reasons: processedFailingReasons,
            components,
            submitted_datetime: new Date() // to be set in rails when the workorder is submitted
        }

        // todo: add username

        // ------------- LOAD ---------------
        const rows = [rowData];
        const insertResult = await bigquery.dataset(DATASET_ID).table(TABLE_ID).insert(rows);
        console.log(insertResult);


        // TODO: what happens if we allow updates AFTER submission (so far not yet)
        // BQ seems to not support updating single rows and more research needed
        // update/insert operation can be specified in pubsub message
    } catch (e) {
        console.error(e);
    }
}

// 1) Dataset: workorders for the day(s), Grouping: pass/fail
exports.queryAllByDateRange = async (req, res) => {
    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    const { start, end } = req.query;

    if (!!start === !!end) {
        // if both params are either both supplied or none
        const sqlQuery = !!start ? `
            SELECT *
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE submitted_datetime BETWEEN @start AND @end
            ORDER BY workorder_id DESC
        ` : `
            SELECT *
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            ORDER BY workorder_id DESC
        `;
        const options = {
            query: sqlQuery,
            location: 'asia-southeast1'
        }
        if (!!start) options.params = { start, end };

        const response = await bigquery.query(options);
        let results = response[0];

        const categorised = [
            {label: 'Passed', workorders: [], occurences: 0},
            {label: 'Failed', workorders: [], occurences: 0}
        ]
        for (const workorder of results) {
            if (workorder.passed) {
                categorised[0].workorders.push(workorder);
            } else {
                categorised[1].workorders.push(workorder);
            }
        }
        // count occurences
        categorised.forEach((category, i) => {
            categorised[i].occurences = category.workorders.length;
        })

        res.status(200).send(categorised);
    } else {
        res.status(400).send('Short of start/end query params');
        return;
    }
}

// 2) Dataset: machine types, Grouping: P/F. Bar graph where each block is a machine type. Each block split into 2 cols for pass/fail
// TODO: if want to, append workorders (minimally ids) to account pass/fail count
exports.queryAcrossMachineTypes = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    const { start, end } = req.query;

    if (!!start === !!end) {
        const sqlQuery = !!start ? `
            SELECT *
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE submitted_datetime BETWEEN @start AND @end
            ORDER BY workorder_id DESC
        ` : `
            SELECT *
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            ORDER BY workorder_id DESC
        `;
        const options = {
            query: sqlQuery,
            location: 'asia-southeast1'
        }
        if (!!start) options.params = { start, end };

        const response = await bigquery.query(options);
        let results = response[0];

        const categorised = [];
        for (const workorder of results) {
            const { machine_type_id, machine_type_name, passed } = workorder;
            const machineTypeCategoryIndex = categorised.findIndex(el => el.machine_type_id === +machine_type_id);
            if (machineTypeCategoryIndex === -1) {
                // add a new category
                categorised.push({
                    machine_type_id: +machine_type_id,
                    machine_type_name,
                    passed_count: 0,
                    failed_count: 0
                })
            }
            if (passed) {
                categorised.find(el => el.machine_type_id === +machine_type_id).passed_count += 1;
            } else {
                categorised.find(el => el.machine_type_id === +machine_type_id).failed_count += 1;
            }
        }

        res.status(200).send(categorised);
    } else {
        res.status(400).send('Short of start/end query params');
        return;
    }
}

// 3) Dataset: Component types for a machine type:, Grouping: P/F. Bar graph where each block is a component type for a particular machine type. Each block split into 2 cols for pass/fail
// TODO: if want to, append workorders (minimally ids) to account pass/fail count
exports.queryComponentTypesOneMachineType = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    const { start, end, machineTypeId } = req.query;

    if (!machineTypeId) {
        res.status(400).send('Missing Machine Type ID param');
        return;
    }

    if (!!start === !!end) {
        const sqlQuery = !!start ? `
            SELECT components
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE submitted_datetime BETWEEN @start AND @end
            AND machine_type_id = @machineTypeId
            ORDER BY workorder_id DESC
        ` : `
            SELECT components
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE machine_type_id = @machineTypeId
            ORDER BY workorder_id DESC
        `;
        const options = {
            query: sqlQuery,
            location: 'asia-southeast1',
            params: { machineTypeId: parseInt(machineTypeId, 10) }
        }
        if (!!start) {
            options.params.start = start;
            options.params.end = end;
        }

        const response = await bigquery.query(options);
        let results = response[0].map(el => el.components).flat();
        
        const categorised = [];
        for (const component of results) {
            const component_type_id = +component.component_type_id;
            const componentTypeCategoryIndex = categorised.findIndex(el => el.component_type_id === component_type_id);
            if (componentTypeCategoryIndex === -1) {
                // add a new category
                categorised.push({
                    component_type_id,
                    component_type_name: component.component_type_name,
                    passed_count: 0,
                    failed_count: 0
                })
            }
            if (component.status) {
                categorised.find(el => el.component_type_id === component_type_id).passed_count += 1;
            } else {
                categorised.find(el => el.component_type_id === component_type_id).failed_count += 1;
            }
        }

        res.status(200).send(categorised);
    } else {
        res.status(400).send('Short of start/end query params');
        return;
    }
}

// 5) Dataset: failing reasons for a machine type, grouping: failing reasons types
exports.getFailingReasonsOneMachineType = async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    }

    const { start, end, machineTypeId } = req.query;

    if (!machineTypeId) {
        res.status(400).send('Missing Machine Type ID param');
        return;
    }

    if (!!start === !!end) {
        // if both params are either both supplied or none
        const sqlQuery = !!start ? `
            SELECT failing_reasons, workorder_number, workorder_id
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE machine_type_id = @machineTypeId
            AND submitted_datetime BETWEEN @start AND @end
            ORDER BY workorder_id DESC
        ` : `
            SELECT failing_reasons, workorder_number, workorder_id
            FROM \`tsh-qc.${DATASET_ID}.${TABLE_ID}\`
            WHERE machine_type_id = @machineTypeId
            ORDER BY workorder_id DESC
        `;
        const options = {
            query: sqlQuery,
            location: 'asia-southeast1',
            params: { machineTypeId: parseInt(machineTypeId, 10) }
        }
        if (!!start) {
            options.params.start = start;
            options.params.end = end;
        }

        const response = await bigquery.query(options);
        let results = response[0];

        const categorised = [];

        for (const result of results) {
            const {failing_reasons: failingReasons, workorder_number, workorder_id} = result;
            for (const failingReason of failingReasons) {
                const failingReasonIndex = categorised.findIndex(el => el.id === +failingReason.id);
                const occurences = +failingReason.occurences;
                const workorderObj = {
                    workorder_number,
                    workorder_id,
                    occurences
                }
                if (failingReasonIndex === -1) {
                    // failing reason category does not exist in "categorised" yet
                    categorised.push({
                        id: +failingReason.id,
                        name: failingReason.name,
                        occurences,
                        workorders: [workorderObj]
                    })
                } else {
                    categorised[failingReasonIndex].occurences = categorised[failingReasonIndex].occurences + occurences;
                    categorised[failingReasonIndex].workorders.push(workorderObj); // push new workorder object
                }
            }
        }

        res.status(200).send(categorised);
    } else {
        res.status(400).send('Short of start/end query params');
        return;
    }
}