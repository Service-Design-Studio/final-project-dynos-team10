import { Routes, Route, useLocation } from "react-router-dom";
import ComponentStatus from './views/ComponentStatus';
import QCEntry from './views/QCEntry'
import App from './App';
import Camera from "./views/Camera";
import PhotoReview from "./views/PhotoReview";
import Register from "./views/Register";
import { RequireAuth } from './helpers/auth';
import Layout from './Layout';
import Login from "./views/Login";
import { useEffect } from "react";
import useAuth from "./hooks/useAuth";
import Home from "./views/Home";

function Router() {
    let location = useLocation();
    const { verifyToken } = useAuth();

    const publicRoutes = ['/register', '/login'];

    useEffect(() => {
        console.log(`location has changed: ${location.pathname}`);
        if (!publicRoutes.some(pubRouteName => location.pathname.includes(pubRouteName))) {
            // TODO: what happens if verifyToken is awaited?
            verifyToken();
        }
    }, [location])

    return (
        <Routes>
            {/* <Route path="/" element={<App/>} /> */}
            {/* <Route path="/component-status" element={<ComponentStatus/>} />
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
            </Route>
        </Routes>
    )
}

export default Router;