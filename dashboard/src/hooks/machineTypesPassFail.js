import { scaleOrdinal } from '@visx/scale';
import { useMantineTheme } from '@mantine/core';
import { $functionsAxios } from '../helpers/axiosHelper';
import { subDays, formatISO9075 } from 'date-fns';
import { useState, useEffect } from 'react';

export default function machineTypePassFail(numDays=1) {
    const theme = useMantineTheme();
    const [data, getData] = useState([]);
    
    const dataForMachineType = async(days) => {
        const now = new Date();
        const then = subDays(now, days);
        const params = new URLSearchParams({
            start: formatISO9075(then),
            end: formatISO9075(now)
        })
        const result = await $functionsAxios.get(`machine-types?${params.toString()}`);
        console.log(result);
        return result;
    }

    useEffect(() => {
        (async() => {
            const result = await dataForMachineType(numDays)
            console.log(result.data)
            getData(result.data)
        })()
    },[numDays])

    const keys = ['passed_count', 'failed_count']

    const colourScale = scaleOrdinal({
        domain: keys,
        range: [theme.colors.cyan[6],
                theme.colors.red[6]]
    })

    const valueAccessorFunction = d => d.machine_type_name;


    return {data, keys, colourScale, valueAccessorFunction}

}