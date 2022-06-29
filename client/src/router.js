import { Routes, Route } from "react-router-dom";
import ComponentStatus from './views/ComponentStatus';
import QCEntry from './views/QCEntry'
import App from './App';
import Camera from "./views/Camera";
import PhotoReview from "./views/PhotoReview";
import Register from "./views/Register";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/component-status" element={<ComponentStatus/>} />
            <Route path="/camera" element={<Camera/>} />
            <Route path="/photo-review" element={<PhotoReview/>} />
            <Route path="/qc-entry" element={<QCEntry/>} />
            <Route path="/register" element={<Register/>}/>
        </Routes>
    )
}

export default Router;