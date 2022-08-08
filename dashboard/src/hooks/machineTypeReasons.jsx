import { scaleOrdinal } from '@visx/scale';
import { useEffect, useMemo, useState } from "react";
import { subDays, formatISO9075 } from 'date-fns';
import { $functionsAxios } from '../helpers/axiosHelper';
import { useMantineTheme } from '@mantine/core';

export default function machineTypeReasons(machineTypeID) {
    const theme = useMantineTheme();
    const [binaryCategorisedReasons, setBinaryCategorisedReasons] = useState([]);


    const dataForMachineType = async(machinetypeID) => {
        const id = 1
        // const id = machineTypeID
        const result = await $functionsAxios.get(`machine-type-failing-reasons?machineTypeId=${id}`)
        // console.log(result);
        return result
    }

    useEffect(() => {
        (async() => {
            const result = await dataForMachineType(machineTypeID);
            // console.log(result.data);
            console.log(result.data.length)
            setBinaryCategorisedReasons(result.data);
        })()
    }, [])

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
            theme.colors.cyan[6],
            theme.colors.red[6],
            theme.colors.grape[6],
            theme.colors.violet[6],
            
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