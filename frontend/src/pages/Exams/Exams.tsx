import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./Exams.module.css";
import ExamTable from "./components/ExamTable";
import type { Exam } from "./types/ExamsType";

import { getUserSession } from "../../utils/session/getUserSession";
import { DeleteExamService } from "../../api/services/exams/DeleteExamService";
import { GetAllExamesService } from "../../api/services/exams/GetAllExamsService";

export default function Exams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const loadExams = async () => {
      try {
        setError("");
        const user = getUserSession();
        const data = await GetAllExamesService(user.id);
        setExams(data);
      } catch {
        setError("Erro ao carregar provas");
      }
    };
    loadExams();
  }, []);

  const startCreate = () => {
    navigate("/exams/create");
  };

  const startEdit = (exam: Exam) => {
    sessionStorage.setItem("editing_exam", JSON.stringify(exam));
    navigate(`/exams/edit/${exam.id}`);
  };

  const handleDelete = async (id: number) => {
    const user = getUserSession();
    try {
      await DeleteExamService(String(user.id), String(id));
      setExams((prev) => prev.filter((e) => e.id !== id));
    } catch {
      setError("Erro ao excluir prova");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/home?type=professores")}>
        ⬅ Voltar
      </button>

      <h1 className={styles.title}>Gerenciar Provas</h1>

      <button className={styles.newBtn} onClick={startCreate}>
        + Nova Prova
      </button>

      <ExamTable exams={exams} handleDelete={handleDelete} startEdit={startEdit} />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
}
