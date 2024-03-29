import { useDispatch, useSelector } from "react-redux";
import { setToken, setIsAuthenticated } from "./store/auth/authSlice";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { FaArrowLeft} from "react-icons/fa";
import "./views/PhotoReview.css";
import { selectWorkorderNumber, startNewWorkorder } from "./store/workorder/workorderSlice";
import { $axios } from "./helpers/axiosHelper";
import { FaUserCog } from "react-icons/fa";
import { Logout } from '@mui/icons-material'
import TSHlogo from './assets/TSHlogo.svg';

import {
    ActionIcon,
    Header,
    MediaQuery,
    Burger,
    useMantineTheme,
    Button, 
    Drawer,
    Stack,
    Menu,
    Center,
    Container,
    Text
  } from "@mantine/core";

// hash map, key -> route, value -> title at header, both are strings
const routeMapStatic = {
    "/qc-entry": "QC Entry",
    "/failreasons": "Fail Reasons",
    "/pass": "Pass",
    '/qc-list': 'QC List',
    '/pass-fail': 'Status',
    '/profile': 'Profile',
    '/label-result': 'Label Result',
    "/": "Home",
}
let routeHideArr = ["/camera", "/photo-review"]; // routes to hide header

// Insert navbar and global layouts here
export default function Layout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [workorders, setWorkorders] = useState([]);
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);

    useEffect(() => {
        // whenever the drawer is opened (opened === true), get the latest N drafts
        // (i.e. 1 page, backend defines how many pages)
        (async() => {
            if (opened) {
                const response = await $axios.get('workorders/page/1?completed=0');
                setWorkorders(response.data.result);
            }
        })()
    }, [opened]);
    

    const [title, setTitle] = useState("") // set title at header
    const [visibility, setVisibility] = useState(true); // visibility of header

    const routeMap = useMemo(() => {
        return {
            '/component-status': currentWorkorderNumber,
            '/status-report' : currentWorkorderNumber,
            ...routeMapStatic,
        }
    }, [currentWorkorderNumber])

    const logout = () => {
        dispatch(setToken(''));
        dispatch(setIsAuthenticated(false));
        navigate('/login');
    }

    useEffect(() => {
        // location.pathname is a string of current route
        if (location.pathname in routeMap) {
            setVisibility(true);
            setTitle(routeMap[location.pathname]);
            return;
        }
        else if (routeHideArr.includes(location.pathname)){
            setVisibility(false);
            setTitle(""); // in case navbar still shows, title = ""
            return;
        }
    }, [location, routeMap])

    const SideBar = () => {
        return(
            <Drawer 
                opened={opened}
                onClose={() => setOpened(false)}
                title="Dynostic"
                padding="md"
                size="sm"
                position="right"
                >
                <Stack justify="space-between" style={{height: "90%"}}>
                    <Stack
                        align="flex-start"
                        >  
                        <Button
                            color="dark"
                            variant="subtle"
                            onClick={() => {
                                navigate('/');
                                setOpened(false);
                                }}
                            >
                                Home
                        </Button>

                        <Button
                            color="dark"
                            variant="subtle"
                            onClick={() => {
                                navigate('/qc-entry');
                                setOpened(false);
                                }}
                            >
                            New Entry
                        </Button>

                        <Menu 
                            control={                  
                                <Button
                                color="dark"
                                variant="subtle"
                                className="list-drafts-btn"
                                >
                                    Drafts
                                </Button>}
                        >
                            {/* fill in with work order drafts */}
                            {
                                workorders.map(el => {
                                    return (
                                        <WorkorderButton
                                            key={el.id}
                                            workorder={el}
                                        />
                                    )
                                })
                            }
                        </Menu>
                    </Stack>

                    <Stack>
                        <Button
                            variant="light"
                            onClick={() => {
                                navigate('/profile');
                                setOpened(false);
                            }}
                            leftIcon={<FaUserCog size={24}/>}
                        >
                            Profile
                        </Button>
                        <Button 
                            onClick={logout}
                            leftIcon={<Logout/>}
                        >
                            Log Out
                        </Button>
                        <Center>
                            <img src={TSHlogo} width="140rem" ></img>
                        </Center>
                        
                    </Stack>
                </Stack>
            </Drawer>
        )
    };

    const BackButton = () => {
        if (title!=="Home") {
            return(                             
            <div> 
                <ActionIcon 
                    onClick={() => navigate(-1)} 
                    style={{backgroundColor: "transparent", marginRight: "1rem"}} >
                    <FaArrowLeft style={{color: "black", fontSize: "1.5rem"}} 
                    />
                </ActionIcon> 
            </div>
             );

        };
    };

    const WorkorderButton = ({ workorder }) => {
        const { workorder_number: workorderNumber } = workorder;
       
        return (
            <Button
                data-workorder-number={workorderNumber}
                className="draft-workorder-btn"
                fullWidth color="dark"
                variant="subtle"
                onClick={() => commitSelectedWorkorder(workorderNumber)}
            >
                {workorderNumber}
            </Button>
        )
    }

    const commitSelectedWorkorder = (selectedWorkorderNumber) => {
        if (selectedWorkorderNumber === currentWorkorderNumber && location.pathname === '/component-status') {
            return;
        }

        dispatch(startNewWorkorder(selectedWorkorderNumber));
        if (location.pathname !== '/component-status') {
            navigate('/component-status');
        }
    }

    return (
        <>
            {visibility ? 

                <Header height={70} p="md">

                    <SideBar/>
                
                    <div style={{ 
                            display: "flex", 
                            flexDirection:"row", 
                            justifyContent:"space-between", 
                            alignItems: "center", 
                            height: "100%" }}
                    >
                        {/* <div
                            style={{ 
                                display: "flex", 
                                flexDirection:"row", 
                                justifyContent:"space-between", 
                                alignItems: "center", 
                                height: "100%" }}
                        > */}
                            <BackButton/>

                            {/* <img src={TSHlogo} width="90rem" style={{marginLeft: "1.2rem"}}></img> */}
                            <Container>
                                <Center>
                                    <Text size="xl" weight={500} ml="sm">{title}</Text>
                                </Center>
                            </Container>
                            {/* <img src={TSHlogo} width="90rem" style={{marginRight: "1.2rem"}}></img> */}
                        {/* </div> */}
                            
                            <MediaQuery>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="sm"
                                    className="navbar-btn"
                                    />
                            </MediaQuery>

                    </div>
                </Header>

            : null}

            <Outlet />
        </>
    )
}