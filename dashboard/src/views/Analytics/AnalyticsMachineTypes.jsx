import BarGroupChart from "../../components/BarGroupChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import machineTypePassFail from "../../hooks/machineTypesPassFail";
import DaySlider from "../../components/DaySlider";
import { Group } from "@mantine/core";
import { debounce } from 'lodash';
import { useState, useMemo } from "react";

export default function AnalyticsMachineTypes() {
    const [value, setValue] = useState(0); // value of slider
    const debouncedSetValue = debounce(val => {
        setValue(val)
    }, 500)

    const {data, keys, colourScale, valueAccessorFunction} = machineTypePassFail(value + 1);
    console.log(data);

    const chartSize = .3*window.innerWidth;

    return (
        <Group
            position="center"
            align="flex-start"
            mt="sm"
        >
            <div style={{width: chartSize, height: chartSize, marginRight: '5rem'}}>
                <ParentSize>
                    {({ width, height }) => (
                        <BarGroupChart
                            width={width}
                            height={height}
                            data={data}
                            keys={keys}
                            colorScale={colourScale}
                            accessor={valueAccessorFunction}
                        />
                    )}
                </ParentSize>
            </div>

            <div style={{width: chartSize}}>
                <DaySlider setValue={debouncedSetValue}/>
                {/* <WorkorderItems chartSize={chartSize} items={workordersFormatted} /> */}
            </div>
        </Group>
    )
}

