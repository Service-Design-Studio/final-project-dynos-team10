import { Routes, Route } from "react-router-dom";
import ComponentStatus from './views/ComponentStatus';
import App from './App';
import Camera from "./views/Camera";
import PhotoReview from "./views/PhotoReview";

function Router() {
    return (
        <Routes>
            <Route path="/" element={<App/>} />
            <Route path="/component-status" element={<ComponentStatus/>} />
            <Route path="/camera" element={<Camera/>} />
            <Route path="/photo-review" element={<PhotoReview/>} />
        </Routes>
    )
}

export default Router;