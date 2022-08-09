import { scaleOrdinal } from '@visx/scale';
import { useEffect, useMemo, useState } from "react";
import { subDays, formatISO9075 } from 'date-fns';
import { $functionsAxios } from '../helpers/axiosHelper';
import { useMantineTheme } from '@mantine/core';

export default function usePassFailAnalytics(numDays=1) {
    const theme = useMantineTheme();
    const [binaryCategorisedWorkorders, setBinaryCategorisedWorkorders] = useState([]);

    const getPreviousDaysWorkorders = async (numDays=1) => {
        const now = new Date();
        const then = subDays(now, numDays);
        const params = new URLSearchParams({
            start: formatISO9075(then),
            end: formatISO9075(now)
        })
        const url = import.meta.env.MODE === "production" ? 'prod-date-range-query' : 'date-range-query';
        return await $functionsAxios.get(`${url}?${params.toString()}`);
    }

    useEffect(() => {
        (async() => {
            console.log({numDays});
            const result = await getPreviousDaysWorkorders(numDays);
            // console.log(result.data);
            setBinaryCategorisedWorkorders(result.data);
        })()
    }, [numDays])

    const getCategoryColor = scaleOrdinal({
        domain: ['Passed', 'Failed'],
        range: [
            theme.colors.cyan[6],
            theme.colors.red[6]
        ]
    })

    const valueAccessorFunction = d => d.occurences;

    return { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction };
}