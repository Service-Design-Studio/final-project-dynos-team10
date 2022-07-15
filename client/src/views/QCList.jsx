import { $axios } from '../helpers/axiosHelper';
import { Card, Center, Group, Loader, Pagination, Text, Modal, Button, Stack } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { startNewWorkorder } from '../store/workorder/workorderSlice';
import { useNavigate } from 'react-router-dom';

export default function QCList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [workorders, setWorkorders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedWorkorderNumber, setSelectedWorkorderNumber] = useState('');
    const RESULTS_PER_PAGE = 10;

    const WorkorderCard = ({ workorder }) => {
        const { workorder_number: workorderNumber } = workorder;
        const chooseWorkorder = () => {
            setSelectedWorkorderNumber(workorderNumber);
            setModalOpened(true);
        }
        return (
            <Card shadow="md" p="md" mx="sm" onClick={chooseWorkorder} mb="xs">
                <Group position="apart">
                    <Text weight={500} >{workorderNumber}</Text>
                </Group>
            </Card>
        )
    }

    const [workordersTotal, setWorkordersTotal] = useState();
    const numPages = useMemo(() => {
        let pages = Math.floor(workordersTotal/RESULTS_PER_PAGE);
        if (workordersTotal % RESULTS_PER_PAGE !== 0) {
            pages += 1;
        }
        return pages;
    }, [workordersTotal]);
    const [currentPage, setCurrentPage] = useState(1); // page number starts from 1 not 0
    
    useEffect(() => {
        (async() => {
            const response = await $axios.get('workorders/total');
            setWorkordersTotal(response.data.result);
        })()
    }, [])
    useEffect(() => {
        (async() => {
            if (workordersTotal) {
                setIsLoading(true);
                const response = await $axios.get(`workorders/page/${currentPage}`);
                setWorkorders(response.data.result);
                setIsLoading(false);
            }
        })();
    }, [currentPage, workordersTotal])

    const commitSelectedWorkorder = () => {
        dispatch(startNewWorkorder(selectedWorkorderNumber));
        navigate('/component-status');
    }

    return (
        <div>
            <Stack mt="sm" p="xs">
                <Pagination total={numPages} page={currentPage} onChange={setCurrentPage} mb="md" />
                {
                    isLoading ?
                    <Center style={{ height: .6*window.innerHeight }}>
                        <Loader size="lg"/>
                    </Center> :
                    <div style={{overflowY: 'scroll', maxHeight: .7*window.innerHeight }}>
                        {
                            workorders.map(el => {
                                return (
                                    <WorkorderCard
                                        key={el.id}
                                        workorder={el}
                                    />
                                )
                            })
                        }
                    </div>
                }
            </Stack>
            <Modal
                centered
                title="Confirm Selection"
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
            >
                <Text>
                    Are you sure you want to proceed with work order
                    <Text component='span' weight={500}> {selectedWorkorderNumber}</Text>?
                </Text>
                <Button mt="md" onClick={commitSelectedWorkorder}>Proceed</Button>
            </Modal>
        </div>
    )
}