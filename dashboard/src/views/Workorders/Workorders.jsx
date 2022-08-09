import { $axios } from '../../helpers/axiosHelper';
import { useEffect, useState, useMemo } from "react"
import { getCompletedWorkorders, getFullWorkorder } from "../../helpers/workorderHelper"
import { debounce } from 'lodash';
import React, { useCallback } from 'react';
import { 
    TextInput, 
    Checkbox, 
    Button, 
    Group, 
    Box, 
    ActionIcon, 
    useMantineTheme, 
    Table, 
    Pagination, 
    Loader,
    Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AiOutlineSearch } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { BsArrowRightCircleFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';

export default function Workorders() {

    const theme = useMantineTheme();
    const navigate = useNavigate();

    const [ query, setQuery ] = useState(""); // search bar
    const [ workorders, setWorkorders ] = useState([]); // workorder details
    const [ fullWorkorders, setFullWorkorders ] = useState([]); // another set of details

    const [isLoading, setIsLoading] = useState(true); // loader
    const [workordersTotal, setWorkordersTotal] = useState(); // total number of workorders completed
    const [currentPage, setCurrentPage] = useState(1); // page number starts from 1 not 0
    const [filterStatus, setFilterStatus] = useState("Passed")
    const RESULTS_PER_PAGE = 10; 

    const numPages = useMemo(() => { // calculate number of pages
        let pages = Math.floor(workordersTotal/RESULTS_PER_PAGE);
        if (workordersTotal % RESULTS_PER_PAGE !== 0) {
            pages += 1;
        }
        return pages;
    }, [workordersTotal]);
    
    useEffect(() => { // get total number of workorders
        (async() => {
            setIsLoading(true);
            const response = await $axios.get('workorders/total?completed=1');
            setWorkordersTotal(response.data.result);
        })()
    }, [])

    // if query (searched item) changes,
    // 1. workordersTotal changes -> pagination changes
    // 2. workorders array changes -> return table result changes

    useEffect(() => {
        (async() => {
            if (query.length > 0) {
                const response = await $axios.get(`workorders/total?workorder_number=${query}&completed=1`)
                console.log(response.data.result);
                setWorkordersTotal(response.data.result);
                setCurrentPage(1); // start from page 1 in pagination
                const response_workorders = await $axios.get(`/workorders/page/${currentPage}?res_per_page=10&workorder_number=${query}&completed=1`);
                console.log(response_workorders.data.result);
                setWorkorders(response_workorders.data.result);
            } else {
                const response = await $axios.get('workorders/total?completed=1');
                setWorkordersTotal(response.data.result);
                setWorkorders(await getCompletedWorkorders(currentPage));
            }
        })();
    },[query]);

    // this only changes when user clicks on pagination or after refresh
    useEffect(() => {
        (async() => {
            if (query.length > 0) {
                const response = await $axios.get(`/workorders/page/${currentPage}?res_per_page=10&workorder_number=${query}&completed=1`);
                console.log(response.data.result);
                setWorkorders(response.data.result);
            } else {
                setWorkorders(await getCompletedWorkorders(currentPage));
            }
            
        })();
    }, [currentPage]);
    
    // useEffect(() => {
    //     (async() => {
    //         setIsLoading(true);
    //         setWorkorders(await getCompletedWorkorders(currentPage));
    //         // console.log(await getCompletedWorkorders()); 
    //         // workorders.map( async (el) => { // this method is bad :(
    //         //     fullWorkorders.push(await getFullWorkorder(el.id));
    //         // })
    //     })();
    // }, [currentPage, workordersTotal]);

    const handleSearch = debounce((text) => { 
        setQuery(text);
    }, 900);

    // get full workorders
    useEffect(() => { 
        (async() => {
            console.log(workorders);
            setIsLoading(true);
            let formattedWorkorders = await Promise.all(workorders.map(async (el) => {
                return await getFullWorkorder(el.id);
            }));
            console.log({formattedWorkorders})
            setFullWorkorders(formattedWorkorders);
            setIsLoading(false);
        })();
        
    }, [workorders]);

    const form = useForm({
        initialValues: {
            workorder: '',
        },
        
    });
    

    const WorkorderRow =  ({ workorder }) => { // each row on the table 
        const { id: ID, machineType: machineType, workorderNumber: workorderNumber, passed: pass } = workorder;
        
        return (
            <tr key={ID} style={{backgroundColor: !pass && theme.colors.gray[0] }}>
                <td>{ID}</td>
                <td>{machineType}</td>
                <td>{workorderNumber}</td>
                <td>{pass ? "Passed" : "Failed"}</td>
                <td>{
                    <Button  className={workorderNumber} variant="filled" onClick={() => navigate(`/workorders/${ID}`)}>
                        Details
                    </Button>
                }</td>
            </tr>
        )
    }


    return (
        <div>

            <Box sx={{ maxWidth: 500, alignItems: "flex-start", marginTop: "1rem"}}>
                <form style={{ height: "3.3rem"}} onSubmit={form.onSubmit((values) => console.log(values))}>
                    <TextInput
                        icon={<AiOutlineSearch size={20} stroke={1.5} />}
                        placeholder="Search"
                        // {...form.getInputProps('workorder')}
                        // value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </form>
            </Box>

            <Pagination total={numPages} page={currentPage} onChange={setCurrentPage} mb="md" />

            {
                isLoading ?
                    <Center style={{ height: .6*window.innerHeight }}>
                        <Loader size="xl"/>
                    </Center> 
                :
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Machine Type</th>
                                <th>Workorder Number</th>
                                <th>Status</th>
                                <th>More Details</th>
                            </tr>
                        </thead>
                        <tbody className="workorders-list">{
                            fullWorkorders.map(el => {
                                return (
                                    <WorkorderRow
                                        key={el.id}
                                        workorder={el}
                                    />
                                )
                            })
                        }</tbody>
                        
                    </Table>
            }


        </div>
    )
}