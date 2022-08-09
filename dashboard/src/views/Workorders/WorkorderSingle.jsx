import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFullWorkorder } from '../../helpers/workorderHelper';
import ComponentCard from '../../components/ComponentCard';
import { Group, Grid, SimpleGrid, Skeleton, useMantineTheme, Table, Text, Center, Paper } from '@mantine/core';
import { NAVBAR_WIDTH } from '../../Layout';
import { Carousel } from '@mantine/carousel';
import PieChart from "../../components/PieChart";
import { Container } from 'tabler-icons-react';


export default function WorkorderSsingle() {
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
    // const SECONDARY_COL_HEIGHT = PRIMARY_COL_HEIGHT / 2 - theme.spacing.md / 2;

    const Status = () => {
        if (workorder.completed === true) {
            return ("Complete")
        }
        return ("Incomplete")
    }

    // Graphs to include: 1) number of pass/fail COMPONENTS, 2) failing reasons categories

    const InfoTable = () => {
        if (workorder!==null){
        return (
            <div>
                <Paper shadow='xs' withBorder p="lg">
                    <Text size="lg" weight={700} style={{marginBottom: 10}}>Key Information</Text>
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
                </Paper>
            </div>
        )}
    }
    
    return (
        <div>
        {/* <SimpleGrid style={{  }} cols={2} spacing="md" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
            <Grid>
            <Grid.Col>
            </Grid.Col>
            </Grid> */}

            
            <Group style={{maxWidth: window.innerWidth - (2*NAVBAR_WIDTH), maxHeight: window.innerHeight}} position="center" spacing="xl" grow>
                {/* <Container style={{width: (window.innerWidth- (2*NAVBAR_WIDTH))/2}}> */}
                <InfoTable style={{width: ((window.innerWidth - (2*NAVBAR_WIDTH))/2)}}/>
                {/* </Container> */}

                {
                    workorder ?
                    <div style={{ maxHeight: PRIMARY_COL_HEIGHT}}>
                        <Center>
                            <Text size="lg" weight={700}>Components & Images</Text>
                        </Center>
                        <Center>
                            <Carousel
                            align="center"
                            sx={{width: 400}}s
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
            </Group>

        {/* </SimpleGrid> */}
        </div>
    )
}