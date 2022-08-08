import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { useEffect, useMemo } from 'react';
import { scaleBand,scaleOrdinal, scaleLinear } from '@visx/scale';
import { useMantineTheme } from '@mantine/core';

export default function machineTypePassFail(machineID) {
    const theme = useMantineTheme();
    // const [data, getData] = useState([]);
    const data = [{"machine_type_id":1,"machine_type_name":"MTC-SLIM","passed_count":2,"failed_count":6},
    {"machine_type_id":2,"machine_type_name":"MTC-FAT","passed_count":4,"failed_count":1}]



    const colourScale = scaleOrdinal({
        domain: keys,
        range: [theme.colors.red[6],
                theme.colors.cyan[6]]
    })

    const valueAccessorFunction = d => d.machine_type_name;

    return {data, valueAccessorFunction}

}