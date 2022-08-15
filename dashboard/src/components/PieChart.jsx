// https://airbnb.io/visx/pies
import Pie from '@visx/shape/lib/shapes/Pie';
import { Group } from '@visx/group';
import { animated, useTransition, to } from '@react-spring/web';
import { useMemo } from 'react';
import { Text } from '@mantine/core';

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

const fromLeaveTransition = ({ endAngle }) => ({
    // enter from 360° if end angle is > 180°
    startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
    endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
    opacity: 0,
})

const enterUpdateTransition = ({ startAngle, endAngle }) => ({
    startAngle,
    endAngle,
    opacity: 1,
});

function AnimatedPie({
    animate,
    arcs,
    path,
    getKey,
    getColor,
    onClickDatum,
}) {
    const transitions = useTransition(arcs, {
        from: animate ? fromLeaveTransition : enterUpdateTransition,
        enter: enterUpdateTransition,
        update: enterUpdateTransition,
        leave: animate ? fromLeaveTransition : enterUpdateTransition,
        keys: getKey,
    })

    return transitions((props, arc, { key }) => {
        const [centroidX, centroidY] = path.centroid(arc);
        const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

        return (
            <g key={key}>
                <animated.path
                    // compute interpolated path d attribute from intermediate angle values
                    d={to([props.startAngle, props.endAngle], (startAngle, endAngle) => 
                        path({
                            ...arc,
                            startAngle,
                            endAngle
                        }),
                    )}
                    fill={getColor(arc)}
                    onClick={() => onClickDatum(arc)}
                    onTouchStart={() => onClickDatum(arc)}
                />
                {
                    hasSpaceForLabel &&
                    <animated.g style={{ opacity: props.opacity }}>
                        <text
                            fill="black"
                            x={centroidX}
                            y={centroidY}
                            dy=".33em"
                            fontSize={14}
                            textAnchor="middle"
                            pointerEvents="none"
                            style={{overflow: 'visible'}}
                        >
                            {getKey(arc)}
                        </text>
                    </animated.g>
                }
            </g>
        )
    })
}

export default function PieChart({
    width,
    height,
    data,
    valueAccessorFunction,
    getCategoryColor,
    onClick,
    margin = defaultMargin,
    animate = true
}) {
    if (width < 10) return null;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;
    const centerY = innerHeight / 2;
    const centerX = innerWidth / 2;
    const donutThickness = 60;

    const hasData = useMemo(() => {
        return data.reduce((oldVal, item) => oldVal + item.occurences, 0) > 0;
    }, [data]);

    return (
        hasData ?
        <svg width={width} height={height} onClick={onClick}>
            <Group top={centerY + margin.top} left={centerX + margin.left}>
                <Pie
                    data={data}
                    pieValue={valueAccessorFunction}
                    outerRadius={radius}
                    innerRadius={radius - donutThickness}
                    cornerRadius={3}
                    padAngle={0.005}
                >
                    {pie => (
                        <AnimatedPie 
                            {...pie}
                            animate={animate}
                            getKey={arc => arc.data.label}
                            onClickDatum={({ data }) => (
                                animate &&
                                console.log('selected', data)
                            )}
                            getColor={arc => getCategoryColor(arc.data.label)}
                        />
                    )}
                </Pie>
            </Group>
        </svg> :
        <Text>No data found</Text>
    )
}