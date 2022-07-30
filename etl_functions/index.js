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
    // TODO: add
    return await pool('workorders').where('id', id).select('id', 'workorder_number', 'user_id', 'machine_type_id').limit(1);
}
const getMachineType = async (pool, machineTypeId) => {
    return await pool('machine_types').where('id', machineTypeId).select('id', 'type_name').limit(1);
}
const getComponents = async (pool, workorderId) => {
    return await pool('components').where('workorder_id', workorderId).select('id', 'status', 'failing_reasons');
}
// --------------------------------------------------

const transformFailingReasons = (workorderFailingReasons) => {
    // for now, failingReasons is string[][], but will eventually be FailingReason[][] as its own model
    // might not be the most efficient way to count occurences
    const occurenceMap = {};
    workorderFailingReasons.forEach(componentFailingReasons => {
        if (componentFailingReasons && componentFailingReasons.length > 0) {
            componentFailingReasons.forEach(failingReason => {
                occurenceMap[failingReason] = (occurenceMap[failingReason] || 0) + 1;
            })
        }
    })
    const transformed = [];
    for (const [failingReasonCategory, occurences] of Object.entries(occurenceMap)) {
        transformed.push({
            // id: null, // for now no id, until there is a FailingReason model
            name: failingReasonCategory,
            occurences
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
        const { id: workorder_id, workorder_number, user_id, machine_type_id } = workorder[0];
        const { type_name: machine_type_name } = (await getMachineType(pool, machine_type_id))[0];
        const components = await getComponents(pool, workorder_id);
        // TODO: for now, passed workorders means all components pass, which makes logical sense
        // BUT we might need a way in the dashboard to manually set workorder status so this should be a DB implementation
        const passed = components.every(componentObj => componentObj.status);
        const processedFailingReasons = transformFailingReasons(components.map(el => el.failing_reasons));
        
        // ----------- TRANSFORM ---------------
        const rowData = {
            workorder_id,
            workorder_number,
            user_id,
            machine_type_id,
            machine_type_name,
            passed,
            failing_reasons: processedFailingReasons,
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