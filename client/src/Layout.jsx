import { useDispatch } from "react-redux";
import { setToken, setIsAuthenticated } from "./store/auth/authSlice";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { FaArrowLeft} from "react-icons/fa";
import "./views/PhotoReview.css";

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
    Container
  } from "@mantine/core";

// hash map, key -> route, value -> title at header, both are strings
let routeMap = {"/qc-entry": "QC Entry", "/component-status" :  "Machine 123", "/": "Home", "/qrscanner": "QR Scanner", "/failreasons": "Fail Reasons", "/pass": "Pass"}; 
let routeHideArr = ["/camera", "/photo-review"]; // routes to hide header

// Insert navbar and global layouts here
export default function Layout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [workorders, setWorkorders] = useState([]);
    const [selectedWorkorderNumber, setSelectedWorkorderNumber] = useState('');
    

    // location.pathname is a string of current route
    let location = useLocation();
    const [title, setTitle] = useState("") // set title at header
    const [visibility, setVisibility] = useState(true); // visibility of header

    const logout = () => {
        dispatch(setToken(''));
        dispatch(setIsAuthenticated(false));
        navigate('/login');
    }

    useEffect(() => {
        (async() => {
            console.log(`location has changed: ${location.pathname}`);
            if (location.pathname in routeMap) {
                console.log("header visibility = true");
                setVisibility(true);
                setTitle(routeMap[location.pathname]);
                return;
            }
            else if (routeHideArr.includes(location.pathname)){
                console.log("header visibility = false")
                setVisibility(false);
                setTitle(""); // in case navbar still shows, title = ""
                return;
            }
        })();
    }, [location])

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
            <Stack justify="space-between" style={{height: 500}}>
                <Stack
                align="flex-start"
                >                
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
                            >
                                Drafts
                            </Button>}
                    >
                        {/* fill in with work order drafts */}
                        {/* {
                            workorders.map(el => {
                                return (
                                    <WorkorderButton
                                        key={el.id}
                                        workorder={el}
                                    />
                                )
                            })
                        } */}

                        <Button
                        color="dark"
                        variant="subtle"
                        fullWidth>
                            WO1234
                        </Button>
                    </Menu>
                </Stack>

                <Button 
                onClick={logout}
                >
                Log Out
                </Button>

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

    // const WorkorderButton = ({ workorder }) => {
    //     const { workorder_number: workorderNumber } = workorder;
       
    //     return (
    //         <Button color="dark" variant="subtle" onClick={commitSelectedWorkorder} >
    //             {workorderNumber}
    //         </Button>
    //     )
    // }

    // const commitSelectedWorkorder = () => {
    //     setSelectedWorkorderNumber(workorderNumber);
    //     dispatch(startNewWorkorder(selectedWorkorderNumber));
    //     navigate('/component-status');
    // }

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
  
                            <BackButton/>
                            
                            <Container>
                                <Center>
                                    <h2 style={{marginLeft: 20}}>{title}</h2>
                                </Center>
                            </Container>

                            <MediaQuery>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="sm"
                                    />
                                
                            </MediaQuery>
                        

                    </div>
                </Header>

            : null}

            <Outlet />
        </>
    )
}