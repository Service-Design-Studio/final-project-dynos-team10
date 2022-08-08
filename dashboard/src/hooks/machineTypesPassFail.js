import { scaleOrdinal } from '@visx/scale';
import { useMantineTheme } from '@mantine/core';
import { $functionsAxios } from '../helpers/axiosHelper';

export default function machineTypePassFail() {
    const theme = useMantineTheme();
    // const [data, getData] = useState([]);

    // useEffect(() => {
    //     (async() => {
    //         const result = await $functionsAxios.get(`machine-types`)
    //         console.log(result.data)
    //         getData(result.data)
    //     })
    // })

    const keys = ['passed_count', 'failed_count']

    const data = [{"machine_type_id":1,"machine_type_name":"MTC-SLIM","passed_count":2,"failed_count":6},
    {"machine_type_id":2,"machine_type_name":"MTC-FAT","passed_count":4,"failed_count":1}]


    const colourScale = scaleOrdinal({
        domain: keys,
        range: [theme.colors.red[6],
                theme.colors.cyan[6]]
    })

    const valueAccessorFunction = d => d.machine_type_name;


    return {data, keys, colourScale, valueAccessorFunction}

}