import { Group } from '@visx/group';
import { BarGroup } from '@visx/shape';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';

const defaultMargin = { top: 40, right: 0, bottom: 40, left: 0 };
export const black = '#000000';

export default function BarGroupChart({
    width,
    height,
    data,
    keys,
    colorScale,
    accessor,
    margin = defaultMargin
}) {
    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const x0Scale = scaleBand({
        domain: data.map(accessor),
        padding: 0.2
    })
    const x1Scale = scaleBand({
        domain: keys,
        padding: 0.1
    })

    const yScale = scaleLinear({
        domain: [0, Math.max(...data.map((d) => Math.max(...keys.map((key) => Number(d[key])))))],
    })



    x0Scale.rangeRound([0, xMax]);
    x1Scale.rangeRound([0, x0Scale.bandwidth()]);
    yScale.range([yMax, 0]);


    return width < 10 ? null : (
        <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
                <BarGroup
                    data={data}
                    keys={keys}
                    height={yMax} 
                    x0={accessor}
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
                scale={x0Scale}
                stroke={black}
                tickStroke={black}
                hideAxisLine
                tickLabelProps={() => ({
                    fill: black,
                    fontSize: 18,
                    textAnchor: 'middle',
                })}
            >

            </AxisBottom>
        </svg>
    )
}

