import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import { useNavigate } from 'react-router-dom';
import { Group, Button, Text, Slider, Box, Center } from "@mantine/core";
import { useEffect, useState, useMemo } from "react"


export default function Analytics() {
    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction } = usePassFailAnalytics(2);
    const navigate = useNavigate();

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
        </div>
    )
}