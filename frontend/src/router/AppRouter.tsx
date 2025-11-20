import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
