import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import { Group, Button, Text, Slider, RangeSlider, Box, ScrollArea } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import DaySlider from "../../components/DaySlider";
import WorkorderItems from "../../components/WorkorderItems";

export default function AnalyticsPassFail() {
    const navigate = useNavigate();
    
    // window.addEventListener('touchstart', function(e) {
    //     if (e.type === 'touchstart' && e.cancelable) {
    //         e.preventDefault();
    //         }
    //     });

    const [value, setValue] = useState(0); // value of slider
    const debouncedSetValue = debounce(val => {
        setValue(val)
    }, 500)

    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction } = usePassFailAnalytics(value + 1);
    const chartSize = .3 * window.innerWidth;

    const workordersFormatted = useMemo(() => {
        const formatted = [];

        if (binaryCategorisedWorkorders.length === 0) {
            return formatted;
        }

        formatted.push({
            label: 'Passed Work Orders',
            items: binaryCategorisedWorkorders.find(el => el.label === 'Passed').workorders.map(el => ({
                label: el.workorder_number,
                workorder_id: el.workorder_id
            }))
        })
        formatted.push({
            label: 'Failed Work Orders',
            items: binaryCategorisedWorkorders.find(el => el.label === 'Failed').workorders.map(el => ({
                label: el.workorder_number,
                workorder_id: el.workorder_id
            }))
        })

        return formatted;
    }, [binaryCategorisedWorkorders])

    return (
        <Group position="center" align="flex-start" style={{marginTop: "1rem"}}>
            <div style={{width: chartSize, height: chartSize, marginRight: '5rem'}}>
                <ParentSize>
                    {({ width, height }) => (
                        <PieChart
                            width={width}
                            height={height}
                            data={binaryCategorisedWorkorders}
                            valueAccessorFunction={valueAccessorFunction}
                            getCategoryColor={getCategoryColor}
                        />
                    )}
                </ParentSize>
            </div>

            <div>
                <DaySlider setValue={debouncedSetValue}/>
                <ScrollArea style={{height: 350}} offsetScrollbars>
                    <WorkorderItems chartSize={chartSize} items={workordersFormatted} />
                </ScrollArea>
            </div>

        </Group>
    )
}