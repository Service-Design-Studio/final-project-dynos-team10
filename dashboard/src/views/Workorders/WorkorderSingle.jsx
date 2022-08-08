import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullWorkorder } from '../../helpers/workorderHelper';
import ComponentCard from '../../components/ComponentCard';
import { Group, Grid, SimpleGrid, Skeleton, useMantineTheme, Table, Text, Center } from '@mantine/core';
import { NAVBAR_WIDTH } from '../../Layout';
import { Carousel } from '@mantine/carousel';

export default function WorkorderSingle() {
    const workorderId = parseInt(useParams().workorderId, 10);
    const [workorder, setWorkorder] = useState(null);

    useEffect(() => {
        (async() => {
            if (isNaN(workorderId)) {
                return;
            }
            const result = await getFullWorkorder(workorderId);
            console.log({result});
            setWorkorder(result);
        })()
    }, [workorderId])

    const PRIMARY_COL_HEIGHT = .85*window.innerHeight;
    const theme = useMantineTheme();
    const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

    const Status = () => {
        if (workorder.completed === true) {
            return ("Complete")
        }
        return ("Incomplete")
    }

    // Graphs to include: 1) number of pass/fail COMPONENTS, 2) failing reasons categories
    
    return (
        <SimpleGrid style={{ maxWidth: window.innerWidth - (2*NAVBAR_WIDTH) }} cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <Grid gutter="md">
                <Grid.Col>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
                <Grid.Col>
                    <Skeleton height={SECONDARY_COL_HEIGHT} radius="md" />
                </Grid.Col>
            </Grid>
            {
                workorder ?
                <div style={{ maxHeight: PRIMARY_COL_HEIGHT, overflowY: 'scroll' }}>
                    <Text size="lg" weight={700}>Key Information</Text>
                    <Table mb="md">
                        <tbody>
                            <tr>
                                <td>Work Order Number:</td>
                                <td>{workorder.workorderNumber}</td>
                            </tr>
                            <tr>
                                <td>Machine Type:</td>
                                <td>{workorder.machineType}</td>
                            </tr>
                            <tr>
                                <td>Status:</td>
                                <td><Status/></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Text size="lg" weight={700}>Components & Images</Text>
                    <Center>
                        <Carousel
                        align="center"
                        sx={{width: 400}}
                        >
                            {workorder?.components.map((el, i) => 
                                <Carousel.Slide key={i}> 
                                    <Center>   
                                        <ComponentCard componentRecord={el} key={i} />
                                    </Center>
                                </Carousel.Slide>    )}
                        </Carousel>
                    </Center>
                </div> :
                <Skeleton height={PRIMARY_COL_HEIGHT} radius="md" />
            }
        </SimpleGrid>
    )
}