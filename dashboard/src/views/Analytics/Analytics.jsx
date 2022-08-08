import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import machineTypeReasons from "../../hooks/machineTypeReasons";
import { useNavigate } from 'react-router-dom';
import { Group, Button, Text, Slider, Box, Center } from "@mantine/core";
import { useEffect, useState, useMemo } from "react"


export default function Analytics() {
    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction } = usePassFailAnalytics(2);
    const { binaryCategorisedReasons, categoryColor, valueAccessorFunction1 } = machineTypeReasons(1)
    const navigate = useNavigate();
    console.log(binaryCategorisedWorkorders)
    // console.log(valueAccessorFunction)
    

    return (
        <div>
            <Center><h2 style={{marginBottom: 0}}>Performance Analytics</h2></Center>
                    
            <div style={{width: '400px', height: '400px'}}>
                <ParentSize>
                    {({ width, height }) => (
                        <PieChart
                            width={width}
                            height={height}
                            data={binaryCategorisedWorkorders}
                            valueAccessorFunction={valueAccessorFunction}
                            getCategoryColor={getCategoryColor}
                            onClick={() => navigate('/analytics/pass-fail')}
                        />
                    )}
                </ParentSize>
            </div>

            <div style={{width: '400px', height: '400px'}}>
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
        </div>
    )
}