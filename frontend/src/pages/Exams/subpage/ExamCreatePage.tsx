import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "../Exams.module.css";
import type { Exam } from "../types/ExamsType";

import { getUserSession } from "../../../utils/session/getUserSession";
import { GetAllQuestionBankService } from "../../../api/services/QuestionBank/GetAllQuestionBankService";
import { CreateExamService } from "../../../api/services/exams/CreateExamService";
import { UpdateExamService } from "../../../api/services/exams/UpdateExamService";
import ExamCreateForm from "../components/ExamForm";

export default function ExamCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const emptyExam: Exam = {
    titulo: "",
    quantidade_questoes: 0,
    turmas: [],
    bimestre: 0,
    area: "",
    dia_a_ser_realizada: "",
    hora_a_ser_liberada: "",
    banco_questao_id: 0,
    questoes_id: [],
    metodo_de_selecao_de_ap: "",
  };

  const [exam, setExam] = useState<Exam>(emptyExam);
  const [questionBanks, setQuestionBanks] = useState<any[]>([]);

  // Carregar bancos
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const user = getUserSession();
        const banks = await GetAllQuestionBankService(user.id);
        setQuestionBanks(banks);
      } catch {
        alert("Erro ao carregar bancos");
      }
    };
    loadBanks();
  }, []);

  // Carrega dados ao editar
  useEffect(() => {
    if (isEdit) {
      const saved = sessionStorage.getItem("editing_exam");
      if (saved) setExam(JSON.parse(saved));
    }
  }, [isEdit]);

  const handleSave = async () => {
    const user = getUserSession();

    try {
      if (isEdit) {
        await UpdateExamService(String(user.id), String(id), exam);
      } else {
        await CreateExamService(String(user.id), exam);
      }

      navigate("/exams");
    } catch {
      alert("Erro ao salvar prova");
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/exams")}>
        ⬅ Voltar
      </button>

      <ExamCreateForm
        newExam={exam}
        setNewExam={setExam}
        handleCreate={handleSave}
        close={() => navigate("/exams")}
        isEdit={isEdit}
        questionBanks={questionBanks}
      />
    </div>
  );
}
