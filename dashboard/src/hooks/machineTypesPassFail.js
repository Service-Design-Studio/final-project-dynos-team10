import { scaleOrdinal } from '@visx/scale';
import { useMantineTheme } from '@mantine/core';
import { $functionsAxios } from '../helpers/axiosHelper';
import { useState, useEffect } from 'react';

export default function machineTypePassFail() {
    const theme = useMantineTheme();
    const [data, getData] = useState([]);
    
    const dataForMachineType = async() => {
        const result = await $functionsAxios.get('machine-types');
        console.log(result);
        return result;
    }

    useEffect(() => {
        (async() => {
            const result = await dataForMachineType()
            console.log(result.data)
            getData(result.data)
        })()
    },[])

    const keys = ['passed_count', 'failed_count']

    const colourScale = scaleOrdinal({
        domain: keys,
        range: [theme.colors.red[6],
                theme.colors.cyan[6]]
    })

    const valueAccessorFunction = d => d.machine_type_name;


    return {data, keys, colourScale, valueAccessorFunction}

}