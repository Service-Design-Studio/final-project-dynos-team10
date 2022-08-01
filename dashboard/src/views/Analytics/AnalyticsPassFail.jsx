import PieChart from "../../components/PieChart";
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import usePassFailAnalytics from "../../hooks/usePassFailAnalytics";
import { Group, Button, Text } from "@mantine/core";
import { ContentGroup } from "../../components/CollapsableContentItem";
import { useMemo } from "react";
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
    const { binaryCategorisedWorkorders, getCategoryColor, valueAccessorFunction, viewingWorkorders } = usePassFailAnalytics();
    const chartSize = .3 * window.innerWidth;

    const workordersFormatted = useMemo(() => {
        const formatted = [];

        const passedWorkorders = viewingWorkorders.filter(el => el.passed);
        const failedWorkorders = viewingWorkorders.filter(el => !el.passed);

        formatted.push({
            label: 'Passed Work Orders',
            items: passedWorkorders.map(el => ({
                label: el.workorder_number,
                workorder_id: el.workorder_id
            }))
        })
        formatted.push({
            label: 'Failed Work Orders',
            items: failedWorkorders.map(el => ({
                label: el.workorder_number,
                workorder_id: el.workorder_id
            }))
        })

        return formatted;
    }, [viewingWorkorders])

    const handleClick = e => {
        const el = e.target.closest(`.${WORKORDER_DETAILS_BTN_CLASS}`);
        if (el) {
            let { workorderId } = el.dataset;
            workorderId = parseInt(workorderId, 10);
            console.log({workorderId});
            // if (workorderId) navigate(`workorders/${workorderId}`);
        }
    } 

    return (
        <Group position="center" align="flex-start" style={{height: .9 * window.innerHeight}}>
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
            <div style={{ flexGrow: 1}} onClick={handleClick}>
                {workordersFormatted.map((item, i) => (
                    <ContentGroup
                        key={i}
                        {...item}
                        customItemElBuilder={WorkorderItemBuilder}
                    />
                ))}
            </div>
        </Group>
    )
}