import machineTypeReasons from "../../hooks/machineTypeReasons";
import { useState, useEffect, useMemo } from "react";
import { debounce } from 'lodash';
import { Group, Select } from "@mantine/core";
import DaySlider from "../../components/DaySlider";
import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { $axios } from "../../helpers/axiosHelper";

export default function AnalyticsMachineFailingReasons() {
    const [value, setValue] = useState(0); // value of slider
    const debouncedSetValue = debounce(val => {
        setValue(val)
    }, 500)

    const [machineTypeId, setMachineTypeId] = useState(0);

    const { binaryCategorisedReasons, categoryColor, valueAccessorFunction1 } = machineTypeReasons(machineTypeId, value+1);
    const chartSize = .3*window.innerWidth;

    const [existingMachineTypes, setExistingMachineTypes] = useState([]);
    useEffect(() => {
        (async () => {
            let response;
            try {
                response = await $axios.get('machine_types');
                console.log({response});
                setExistingMachineTypes(response.data.result);
            } catch (e) {
                console.log(e);
            }
        })()
    }, [])
    const existingMachineTypesOptions = useMemo(() => existingMachineTypes.map(el => {
        return {
          value: el.id,
          label: el.type_name
        }
      }), [existingMachineTypes])

    return (

        <Group position="center" align="flex-start" style={{marginTop: "1rem"}}>
            <div style={{width: chartSize + 100, height: chartSize, marginRight: "5rem"}}>
                <ParentSize>
                    {({ width, height }) => (
                        <PieChart
                            width={width}
                            height={height}
                            data={binaryCategorisedReasons}
                            valueAccessorFunction={valueAccessorFunction1}
                            getCategoryColor={categoryColor}
                        />
                    )}
                </ParentSize>
            </div>

            <div style={{width: chartSize}}>
                <Select
                    placeholder="Select Machine Type"
                    searchable
                    clearable 
                    nothingFound="No options"
                    value={machineTypeId}
                    onChange={val => setMachineTypeId(val)}
                    data={existingMachineTypesOptions}
                />
                <DaySlider setValue={debouncedSetValue}/>
            </div>

        </Group>
    )
}