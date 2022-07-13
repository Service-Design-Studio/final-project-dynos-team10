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
    Button
  } from "@mantine/core";

// hash map, key -> route, value -> title at header, both are strings
let routeMap = {"/qc-entry": "QC Entry", "/component-status" :  "Machine 123", "/": "Home"}; 
let routeHideArr = ["/camera", "/photo-review"]; // routes to hide header

// Insert navbar and global layouts here
export default function Layout() {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
                console.log("visibility = true");
                setVisibility(true);
                setTitle(routeMap[location.pathname]);
                return;
            }
            else if (routeHideArr.includes(location.pathname)){
                console.log("visibility = false")
                setVisibility(false);
                setTitle(""); // in case navbar still shows, title = ""
                return;
            }
        })();
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

                            <h2 style={{paddingRight: "1rem"}} >{title}</h2>

                        </div>

                        <div style={{paddingRight: "0.6rem"}} > <Button onClick={logout}>Log Out</Button></div>
                        
                    </div>
                </Header>

            : null}

            <Outlet />
        </>
    )
}