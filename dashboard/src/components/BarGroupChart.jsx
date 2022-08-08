import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { useEffect } from 'react';

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };

export default function BarGroupChart({
    data,
    keys,
    colorScale,
    getx0,
    x0Scale,
    x1Scale,
    tempScale,
    width,
    height,
    margin = defaultMargin
}) {
    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // THE PROBLEM: X0 SCALE IS NOT READ PROPERLY
    useEffect(() => {
        console.log({x0Scale})
        x0Scale.rangeRound([0, xMax]);
        if (x0Scale.bandwith) {
            // PROBLEM: THIS IF BLOCK IS NEVER SATISFIED, EVEN IF YOU CHANGE THE IF BLOCK TO CHECK FOR x0Scale instead of x0Scale.bandwidth
            console.log('ran')
            x1Scale.rangeRound([0, x0Scale.bandwith()]);
        }
    }, [x0Scale])
    useEffect(() => {
        if (tempScale) tempScale.range([yMax, 0]);
    }, [tempScale])

    return width < 10 ? null : (
        <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
                <BarGroup
                    data={data}
                    keys={keys}
                    height={yMax}
                    x0={getx0}
                    x0Scale={x0Scale}
                    x1Scale={x1Scale}
                    yScale={tempScale}
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
            {/* <AxisBottom
                top={yMax + margin.top}
                tickFormat={formatDate}
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

            </AxisBottom> */}
        </svg>
    )
}