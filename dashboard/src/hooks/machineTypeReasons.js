import { scaleOrdinal } from '@visx/scale';
import { useEffect, useMemo, useState } from "react";
import { subDays, formatISO9075 } from 'date-fns';
import { $functionsAxios } from '../helpers/axiosHelper';
import { useMantineTheme } from '@mantine/core';

export default function machineTypeReasons(machineTypeID, numDays=1) {
    const theme = useMantineTheme();
    const [binaryCategorisedReasons, setBinaryCategorisedReasons] = useState([]);

    const dataForMachineType = async(id, days) => {
        const now = new Date();
        const then = subDays(now, days);
        const params = new URLSearchParams({
            start: formatISO9075(then),
            end: formatISO9075(now),
            machineTypeId: id
        })
        const url = import.meta.env.MODE === "production" ? 'prod-machine-type-failing-reasons' : 'machine-type-failing-reasons';
        const result = await $functionsAxios.get(`${url}?${params.toString()}`)
        return result
    }

    useEffect(() => {
        (async() => {
            const result = await dataForMachineType(machineTypeID, numDays);
            console.log(result.data);
            console.log(result.data.length)
            setBinaryCategorisedReasons(result.data);
        })()
    }, [machineTypeID, numDays])

    const colours = (num) => {
        
        const pickcolours = [theme.colors.red[6],
                            theme.colors.pink[6],
                            theme.colors.grape[6],
                            theme.colors.violet[6],
                            theme.colors.indigo[6],
                            theme.colors.blue[6],
                            theme.colors.cyan[6],
                            theme.colors.teal[6],
                            theme.colors.green[6]]

        const final = pickcolours.slice(0, num);
        return (final);        
    }

    const categoryColor = scaleOrdinal({
        domain: ['Passed', 'Failed', 'hi', 'low'],
        range: [
            theme.colors.red[6],
            theme.colors.green[6],
            theme.colors.violet[6],
            theme.colors.blue[6],
            theme.colors.indigo[6],
            theme.colors.cyan[6],
            theme.colors.grape[6],
            theme.colors.teal[6],
            theme.colors.pink[6],
        ]
    })
    console.log(colours(3))

    const valueAccessorFunction1 = d => d.occurences;

    // return { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction, viewingWorkorders };
    return { binaryCategorisedReasons, categoryColor, valueAccessorFunction1 };
}

// [
//     {"id":1,"name":"Crumpled","occurences":2,"workorders":[{"workorder_number":"joel-9","workorder_id":18,"occurences":1},{"workorder_number":"hello joel","workorder_id":10,"occurences":1}]},
//     {"id":2,"name":"Spoilt","occurences":4,"workorders":[{"workorder_number":"mtc-utc-789","workorder_id":14,"occurences":1},{"workorder_number":"joel-5","workorder_id":13,"occurences":2},{"workorder_number":"joel-3","workorder_id":7,"occurences":1}]}
//     ,{"id":3,"name":"Not Connected Properly","occurences":3,"workorders":[{"workorder_number":"joel-5","workorder_id":13,"occurences":1},{"workorder_number":"hello joel","workorder_id":10,"occurences":1},{"workorder_number":"joel-3","workorder_id":7,"occurences":1}]},
//     {"id":4,"name":"Torn","occurences":1,"workorders":[{"workorder_number":"hello joel","workorder_id":10,"occurences":1}]}]