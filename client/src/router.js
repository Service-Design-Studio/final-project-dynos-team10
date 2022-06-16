import { Routes, Route } from "react-router-dom";
import ComponentStatus from './views/ComponentStatus';
import App from './App';
import Camera from "./views/Camera";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/component-status" element={<ComponentStatus/>} />
            <Route path="/camera" element={<Camera/>} />
        </Routes>
    )
}

export default Router;