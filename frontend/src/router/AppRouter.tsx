import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Home from "../pages/Home/Home";
import ProtectedLayout from "../Layout/ProtectedLayout";
import Questions from "../pages/Questions/Questions";
import QuestionBank from "../pages/QuestionBank/QuestionBank";
import Exams from "../pages/Exams/Exams";
import Turmas from "../pages/Turma/Turmas";
import TurmaDetails from "../pages/Turma/subpage/TurmaDetails/TurmaDetails";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/recuper_a_senha" element={<ForgotPassword />} />


                <Route path="/" element={<ProtectedLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="banco_de_questoes" element={<QuestionBank />} />
                    <Route path="gerenciar_professores" element={<QuestionBank />} />
                    <Route path="questoes" element={<Questions />} />
                    <Route path="exams" element={<Exams />} />
                    <Route path="turmas" element={<Turmas />} />
                    <Route path="turmas/:id" element={<TurmaDetails />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
