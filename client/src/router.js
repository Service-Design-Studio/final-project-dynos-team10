import { Routes, Route, useLocation } from "react-router-dom";
import ComponentStatus from './views/ComponentStatus';
import QCEntry from './views/QCEntry'
import App from './App';
import Camera from "./views/Camera";
import PhotoReview from "./views/PhotoReview";
import Register from "./views/Register";
import FailReasons from "./views/FailReasonsM";
import QRScanner from "./views/QRScanner";
import Pass from "./views/Pass";

import { RequireAuth } from './helpers/auth';
import Layout from './Layout';
import Login from "./views/Login";
import { useEffect } from "react";
import Home from "./views/Home";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setIsAuthenticated, setToken } from "./store/auth/authSlice";
import { $axios } from "./helpers/axiosHelper";

function Router() {
    let location = useLocation();

    const publicRoutes = ['/register', '/login'];

    const accessToken = useSelector(selectToken);
    const dispatch = useDispatch();

    const verifyToken = async () => {
        const result = await $axios.get('verify-jwt', {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        console.log({result});
        if (result.data.token_valid) {
            dispatch(setIsAuthenticated(true));
        } else {
            // do sth here before immediately logging out user?
            
            dispatch(setToken(''));
            dispatch(setIsAuthenticated(false));
        }
    }
    
    // useEffect(() => {
    //     verifyToken();
    // }, []);

    useEffect(() => {
        (async() => {
            console.log(`location has changed: ${location.pathname}`);
            if (!publicRoutes.some(pubRouteName => location.pathname.includes(pubRouteName))) {
                if (process.env.NODE_ENV === "development") {
                    dispatch(setIsAuthenticated(true));
                    return;
                }
                // TODO: what happens if verifyToken is awaited?
                await verifyToken();
            }
        })();
    }, [location])

    return (
        <Routes>
            {/* <Route path="/" element={<App/>} /> 
            <Route path="/component-status" element={<ComponentStatus/>} />
            <Route path="/camera" element={<Camera/>} />
            <Route path="/photo-review" element={<PhotoReview/>} />
            <Route path="/qc-entry" element={<QCEntry/>} /> */}
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>} />

            <Route
                path="/"
                element={
                    <RequireAuth>
                        <Layout/>
                    </RequireAuth>
                }
            >
                <Route path="/" element={<Home/>} />
                <Route path="component-status" element={<ComponentStatus/>} />
                <Route path="camera" element={<Camera/>} />
                <Route path="photo-review" element={<PhotoReview/>} />
                <Route path="qc-entry" element={<QCEntry/>} />
                <Route path="/qrscanner" element={<QRScanner/>} />
                <Route path="/failreasons" element={<FailReasons/>} />
                <Route path="/pass" element={<Pass/>} />

            </Route>
        </Routes>
    )
}

export default Router;