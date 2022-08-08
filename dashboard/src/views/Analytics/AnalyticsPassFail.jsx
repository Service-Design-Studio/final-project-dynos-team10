import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import { Group, Button, Text, Slider, RangeSlider, Box } from "@mantine/core";
import { ContentGroup } from "../../components/CollapsableContentItem";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from 'react-router-dom';

const WORKORDER_DETAILS_BTN_CLASS = 'view-workorder-btn';

function WorkorderItemBuilder(item, i, theme) {
    return (
        <Group
            position="apart"
            align="center"
            key={i}
            sx={{
                fontWeight: 700,
                textDecoration: 'none',
                padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
                paddingLeft: 31,
                marginLeft: 30,
                fontSize: theme.fontSizes.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
                borderLeft: `1px solid ${
                    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]
                }`,
                '&:hover': {
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
                    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                },
            }}
        >
            <Text
                key={item.label}
            >
                {item.label}
            </Text>
            <Button
                className={WORKORDER_DETAILS_BTN_CLASS}
                data-workorder-id={item.workorder_id}
            >
                View Details
            </Button>
        </Group>

    )
}

export default function AnalyticsPassFail() {
    const navigate = useNavigate();
    
    // window.addEventListener('touchstart', function(e) {
    //     if (e.type === 'touchstart' && e.cancelable) {
    //         e.preventDefault();
    //         }
    //     });

    const [value, setValue] = useState(0); // value of slider

      // Configure marks to match step
    const MARKS = [
        { value: 0, label: '1' },
        { value: 1, label: '2' },
        { value: 2, label: '3' },
        { value: 3, label: '4' },
        { value: 4, label: '5' },
        { value: 5, label: '6' },
        { value: 6, label: '7' },
    ];

    useEffect(() => {
        console.log(value + 1);
    }, [value]);

    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction, viewingWorkorders } = usePassFailAnalytics(value + 1);
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

    const handleClick = e => {
        const el = e.target.closest(`.${WORKORDER_DETAILS_BTN_CLASS}`);
        if (el) {
            let { workorderId } = el.dataset;
            workorderId = parseInt(workorderId, 10);
            if (workorderId) navigate(`/workorders/${workorderId}`);
        }
    } 

    return (
        <Group position="center" align="flex-start" style={{height: .9 * window.innerHeight, marginTop: "1rem"}}>
            <div style={{width: chartSize, height: chartSize}}>
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
                
                <Box style={{margin: "2rem 0 2rem"}}>
                    <h3 style={{margin: 0}}>Select number of days</h3>
                    <p style={{margin: 0}}> Examples: <br></br> 1: past 24 hours <br></br> 2: past 48 hours</p>
                    <Slider
                        label={(val) => MARKS.find((mark) => mark.value === val).label}
                        defaultValue={0}
                        step={1}
                        marks={MARKS}
                        max={6}
                        onChange={setValue}
                        style={{marginTop: "1rem"}}
                    />
                </Box>

                <div style={{ flexGrow: 1, width: chartSize}} onClick={handleClick}>
                    {workordersFormatted.map((item, i) => (
                        <ContentGroup
                            key={i}
                            {...item}
                            customItemElBuilder={WorkorderItemBuilder}
                        />
                    ))}
                </div>
            
            </div>

        </Group>
        

    )
}