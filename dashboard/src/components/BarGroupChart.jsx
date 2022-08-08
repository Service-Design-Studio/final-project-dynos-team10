import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { useEffect, useMemo } from 'react';
import { scaleBand,scaleOrdinal, scaleLinear } from '@visx/scale';
// import { useMantineTheme } from '@mantine/core';

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };
// const theme = useMantineTheme();
export const green = '#e5fd3d';
const blue = '#aeeef8';

export default function BarGroupChart({
    width,
    height,
    // // data,
    // // keys,
    // // getName,
    // colorScale,
    margin = defaultMargin
}) {
    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // THE PROBLEM: X0 SCALE IS NOT READ PROPERLY

    const data = [{"machine_type_id":1,"machine_type_name":"MTC-SLIM","passed_count":2,"failed_count":6},
    {"machine_type_id":2,"machine_type_name":"MTC-FAT","passed_count":4,"failed_count":1}]
    const keys = ['passed_count', 'failed_count']

    //accessors
    const valueAccessorFunction = d => d.machine_type_name;

    // useEffect(() => {
    //     x0Scale.rangeRound([0, xMax]);
    //     if (x0Scale.bandwidth) {
    //         console.log('ran')
    //         x1Scale.rangeRound([0, x0Scale.bandwidth()]);
    //     }
    // }, [x0Scale])
    // useEffect(() => {
    //     if (tempScale) tempScale.range([yMax, 0]);
    // }, [tempScale])

    const x0Scale = scaleBand({
        domain: data.map(valueAccessorFunction),
        padding: 0.2
    })
    const x1Scale = scaleBand({
        domain: keys,
        padding: 0.1
    })

    const yScale = scaleLinear({
        domain: [0, Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d[key])))))],
    })

    // const colorScale = scaleOrdinal({
    //     domain: keys,
    //     // range: [theme.colors.red[6],
    //     // theme.colors.cyan[6]]
    // })

    const colorScale = scaleOrdinal({
        domain: keys,
        range: [blue, green]
    })

    
    console.log(x0Scale)
    console.log(x1Scale)

    x0Scale.rangeRound([0, xMax]);
    x1Scale.rangeRound([0, x0Scale.bandwidth()]);
    yScale.range([yMax, 0]);


    return width < 10 ? null : (
        <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
                <BarGroup
                    data={data} //array of data [{label: , value: }]
                    keys={keys}//['string']
                    height={yMax} 
                    x0={valueAccessorFunction}
                    x0Scale={x0Scale}
                    x1Scale={x1Scale}
                    yScale={yScale}
                    color={colorScale}
                >
                    {
                        barGroups => barGroups.map(barGroup => (
                            <Group key={`bar-group-${barGroup.index}-${barGroup.x0}`} left={barGroup.x0}>
                                {
                                    barGroup.bars.map(bar => (
                                        <rect 
                                            key={`bar-group-bar-${barGroup.index}-${bar.index}-${bar.value}-${bar.key}`}
                                            x={bar.x}
                                            y={bar.y}
                                            width={bar.width}
                                            height={bar.height}
                                            fill={bar.color}
                                            rx={4}
                                            onClick={() => console.log('hello there')}
                                        />
                                    ))
                                }
                            </Group>
                        ))
                    }
                </BarGroup>
            </Group>
            <AxisBottom
                top={yMax + margin.top}
                // tickFormat={formatDate}
                scale={x0Scale}
                stroke={green}
                tickStroke={green}
                hideAxisLine
                tickLabelProps={() => ({
                    fill: green,
                    fontSize: 11,
                    textAnchor: 'middle',
                })}
            >

            </AxisBottom>
        </svg>
    )
}

