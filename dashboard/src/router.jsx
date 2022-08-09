import { Routes, Route, useLocation } from "react-router-dom";
import Auth from './helpers/Auth';
import { $axios } from "./helpers/axiosHelper";
import { createContext, useEffect, useMemo, useState } from "react";
import Layout from "./Layout";
import Controls from "./views/Controls";
import Analytics from './views/Analytics';
import Workorders, { WorkorderSingle } from "./views/Workorders";
import Login from './views/Login';
import Register from "./views/Register";

const TOKEN_IDENTIFIER = 'accessToken';

const AuthContext = createContext({
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    accessToken: '',
    setAccessToken: () => {}
});

function Router() {
    const location = useLocation();
    const publicRoutes = ['/register', '/login'];

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(localStorage.getItem(TOKEN_IDENTIFIER));
    const authContextValue = useMemo(() => ({ 
        isAuthenticated,
        setIsAuthenticated,
        accessToken,
        setAccessToken
    }), [isAuthenticated, accessToken]);

    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_IDENTIFIER) || '';
        setAccessToken(storedToken);
    }, [])
    useEffect(() => {
        // whenever accessToken changes, store in localStorage
        // console.log('access token changed!', accessToken);
        localStorage.setItem(TOKEN_IDENTIFIER, accessToken);
    }, [accessToken])


    const verifyToken = async () => {
        const result = await $axios.get('verify-jwt', {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });
        // console.log({result});
        if (result.data.token_valid) {
            setIsAuthenticated(true);
        } else {
            setAccessToken('');
            setIsAuthenticated(false);
        }
    }

    useEffect(() => {
        (async() => {
            if (!publicRoutes.some(pubRouteName => location.pathname.includes(pubRouteName)) && accessToken) {
                await verifyToken();
            }
        })();
    }, [location, accessToken])

    return (
        <AuthContext.Provider value={authContextValue}>
            <Routes>
            
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />

                <Route
                    path="/"
                    element={
                        <Auth>
                            <Layout/>
                        </Auth>
                    }
                >
                    <Route path="/" element={<Analytics />} />
                    <Route path="/controls" element={<Controls />} />
                    <Route path="/workorders">
                        <Route path="" element={<Workorders/>}/>
                        <Route path=":workorderId" element={<WorkorderSingle/>} />
                    </Route>
                </Route>
            </Routes>
        </AuthContext.Provider>
    )
}

export { Router as default, AuthContext, TOKEN_IDENTIFIER }