import { scaleOrdinal } from '@visx/scale';
import { useEffect, useMemo, useState } from "react";
import { subDays, formatISO9075 } from 'date-fns';
import { $functionsAxios } from '../helpers/axiosHelper';
import { useMantineTheme } from '@mantine/core';

export default function usePassFailAnalytics() {
    const [viewingWorkorders, setViewingWorkorders] = useState([]);
    const theme = useMantineTheme();

    // should this be done via cloud functions or here?
    const binaryCategorisedWorkorders = useMemo(() => {
        const categorised = [
            {label: 'Passed', workorders: []},
            {label: 'Failed', workorders: []}
        ]
        for (const workorder of viewingWorkorders) {
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
        return categorised
    }, [viewingWorkorders])

    const getPreviousDaysWorkorders = async (numDays=1) => {
        const now = new Date();
        const then = subDays(now, numDays);
        const params = new URLSearchParams({
            start: formatISO9075(then),
            end: formatISO9075(now)
        })
        return await $functionsAxios.get(`date-range-query?${params.toString()}`);
    }

    useEffect(() => {
        (async() => {
            const result = await getPreviousDaysWorkorders(2);
            console.log(result.data[0]);
            setViewingWorkorders(result.data[0]);
        })()
    }, [])

    const getCategoryColor = scaleOrdinal({
        domain: ['Passed', 'Failed'],
        range: [
            theme.colors.cyan[6],
            theme.colors.red[6]
        ]
    })

    const valueAccessorFunction = d => d.occurences;

    return { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction, viewingWorkorders };
}