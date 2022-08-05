import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import { useNavigate } from 'react-router-dom';
import { Group, Button, Text, Slider, Box, Center } from "@mantine/core";
import { useEffect, useState, useMemo } from "react"


export default function Analytics() {
    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction } = usePassFailAnalytics(2);
    const navigate = useNavigate();

    // window.addEventListener('touchstart', function(e) {
    //     if (e.type === 'touchstart' && e.cancelable) {
    //         e.preventDefault();
    //         }
    //     });

    const [value, setValue] = useState(0);

    useEffect( () => { // everytime user changes number in slider
        console.log(value);


    }, [value]);

      // Configure marks to match step
    const MARKS = [
        { value: 0, label: 'Today' },
        { value: 15, label: '1' },
        { value: 30, label: '2' },
        { value: 45, label: '3' },
        { value: 60, label: '4' },
        { value: 75, label: '5' },
        { value: 90, label: 'Past week' },
    ];

    return (
        <div>
            <Center><h2 style={{marginBottom: 0}}>Workorder performance</h2></Center>
            <Box style={{margin: "0 3rem 3rem"}}>
                
                <h3 style={{marginTop: 0}}>Select number of days</h3>
                <Slider
                    label={(val) => MARKS.find((mark) => mark.value === val).label}
                    defaultValue={0}
                    step={15}
                    marks={MARKS}
                    max={90}
                    onChange={setValue}
                />
            </Box>
                    
            <div style={{width: '500px', height: '500px'}}>
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