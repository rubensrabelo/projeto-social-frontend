import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Home from "../pages/Home/Home";
import ProtectedLayout from "../Layout/ProtectedLayout";
import Questions from "../pages/Questions/Questions";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recover-password" element={<ForgotPassword />} />


                <Route path="/" element={<ProtectedLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="questions" element={<Questions />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
