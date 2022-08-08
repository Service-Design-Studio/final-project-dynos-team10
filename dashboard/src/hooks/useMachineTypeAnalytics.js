import { useMantineTheme } from "@mantine/core";
import { useState, useEffect, useMemo } from "react";
import { subDays, formatISO9075 } from 'date-fns';
import { $functionsAxios } from '../helpers/axiosHelper';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';

export default function useMachineTypeAnalytics(numDays=1) {
    const theme = useMantineTheme();
    const [machineTypeCategories, setMachineTypeCategories] = useState([]);
    
    const getData = async (numDays=1) => {
        const now = new Date();
        const then = subDays(now, numDays);
        const params = new URLSearchParams({
            start: formatISO9075(then),
            end: formatISO9075(now)
        })
        return await $functionsAxios.get(`machine-types?${params.toString()}`);
    }

    useEffect(() => {
        (async() => {
            const result = await getData(numDays);
            console.log(result.data);
            setMachineTypeCategories(result.data);
        })()
    }, [numDays])

    const getCategoryColor = scaleOrdinal({
        domain: ['passed_count', 'failed_count'],
        range: [
            theme.colors.cyan[6],
            theme.colors.red[6]
        ]
    })

    const passFailScale = scaleBand({
        domain: ['passed_count', 'failed_count'],
        padding: 0.1
    })
    const machineTypeScale = useMemo(() => scaleBand({
        domain: machineTypeCategories.map(el => el.machine_type_name),
        padding: 0.2
    }), [machineTypeCategories])

    const dataKeys = useMemo(() => {
        if (machineTypeCategories.length <= 0) {
            return [];
        }
        return Object.keys(machineTypeCategories[0]).filter(d => !d.startsWith('machine_type'));
    }, [machineTypeCategories])
    
    const getMachineTypeCategory = d => d.machine_type_name;

    const tempScale = useMemo(() => {
        let domain;
        if (machineTypeCategories && dataKeys) {
            domain = [0, 0];
        } else {
            domain = [0, Math.max(...machineTypeCategories.map((d) => Math.max(...dataKeys.map((key) => Number(d[key])))))];
        }
        return scaleLinear({domain})
    }, [machineTypeCategories, dataKeys])

    return { machineTypeCategories, getCategoryColor, passFailScale, machineTypeScale, getMachineTypeCategory, dataKeys, tempScale };
}