import { useDispatch, useSelector } from "react-redux";
import { setToken, setIsAuthenticated } from "./store/auth/authSlice";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { FaArrowLeft} from "react-icons/fa";
import "./views/PhotoReview.css";
import { selectWorkorderNumber } from "./store/workorder/workorderSlice";

import {
    ActionIcon,
    Header,
    MediaQuery,
    Burger,
    useMantineTheme,
    Button,
    Text
} from "@mantine/core";

// hash map, key -> route, value -> title at header, both are strings
const routeMapStatic = {
    "/qc-entry": "QC Entry",
    "/": "Home",
    "/qrscanner": "QR Scanner",
    "/failreasons": "Fail Reasons",
    "/pass": "Pass",
    '/qc-list': 'QC List'
}
let routeHideArr = ["/camera", "/photo-review"]; // routes to hide header

// Insert navbar and global layouts here
export default function Layout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentWorkorderNumber = useSelector(selectWorkorderNumber);

    // location.pathname is a string of current route
    let location = useLocation();
    const [title, setTitle] = useState("") // set title at header
    const [visibility, setVisibility] = useState(true); // visibility of header

    const routeMap = useMemo(() => {
        return {
            ...routeMapStatic,
            '/component-status': currentWorkorderNumber
        }
    }, [currentWorkorderNumber])
    
    const logout = () => {
        dispatch(setToken(''));
        dispatch(setIsAuthenticated(false));
        navigate('/login');
    }

    useEffect(() => {
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
    }, [location])

    return (
        <>
            {visibility ? 

                <Header height={70} p="md">
                    <div style={{ display: "flex", flexDirection:"row", justifyContent:"space-between", alignItems: "center", height: "100%" }}>
                        
                        <div style={{ display: "flex", flexDirection:"row", alignItems: "center", height: "100%" }}>
                            
                            <MediaQuery>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size="sm"
                                    color={theme.colors.gray[6]}
                                    mr="sm"
                                    />
                            </MediaQuery>

                            <div> 
                                <ActionIcon 
                                    onClick={() => navigate(-1)} 
                                    style={{backgroundColor: "transparent", marginRight: "1rem"}} >
                                    <FaArrowLeft style={{color: "black", fontSize: "1.5rem"}} 
                                    />
                                </ActionIcon> 
                            </div>

                            <Text weight={500} pr="md">{title}</Text>

                        </div>

                        <div style={{paddingRight: "0.6rem"}} > <Button onClick={logout}>Log Out</Button></div>

                    </div>
                </Header>

            : null}

            <Outlet />
        </>
    )
}