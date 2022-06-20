import { Routes, Route } from "react-router-dom";
import ComponentStatus from './views/ComponentStatus';
import QCEntry from './views/QCEntry'
import App from './App';
import Camera from "./views/Camera";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/component-status" element={<ComponentStatus/>} />
            <Route path="/camera" element={<Camera/>} />
            <Route path="/qc-entry" element={<QCEntry/>} />
        </Routes>
    )
}

export default Router;