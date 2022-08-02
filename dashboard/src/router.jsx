import { Routes, Route, useLocation } from "react-router-dom";
import Auth from './helpers/Auth';
import Layout from "./Layout";
import Controls from "./views/Controls";
import Analytics, { AnalyticsPassFail } from './views/Analytics';
import Account from './views/Account';
import Home from './views/Home';
import Workorders, { WorkorderSingle } from "./views/Workorders";

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
                <Route path="/analytics/pass-fail" element={<AnalyticsPassFail />} />
                <Route path="/workorders">
                    <Route path="" element={<Workorders/>}/>
                    <Route path=":workorderId" element={<WorkorderSingle/>} />
                </Route>
                <Route path="/account" element={<Account />} />
            </Route>
        </Routes>
    )
}