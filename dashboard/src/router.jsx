import { Routes, Route, useLocation } from "react-router-dom";
import Auth from './helpers/Auth';
import Layout from "./Layout";
import Controls from "./views/Controls";
import Analytics from './views/Analytics';
import Account from './views/Account';
import Home from './views/Home';

export default function Router() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Auth>
                        <Layout/>
                    </Auth>
                }
            >
                <Route path="/" element={<Home/>} />
                <Route path="/controls" element={<Controls />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/account" element={<Account />} />
            </Route>
        </Routes>
    )
}