import { Box, Slider } from '@mantine/core';

export default function DaySlider({setValue}) {
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

    return (
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

    )
}