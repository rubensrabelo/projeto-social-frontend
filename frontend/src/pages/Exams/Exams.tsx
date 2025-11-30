import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Exams.module.css";

import ExamCreateForm from "./components/ExamForm";
import ExamTable from "./components/ExamTable";
import type { Exam } from "./types/ExamsType";

import { getUserSession } from "../../utils/session/getUserSession";
import { GetAllQuestionBankService } from "../../api/services/QuestionBank/GetAllQuestionBankService";
import { CreateExamService } from "../../api/services/exams/CreateExamService";

export default function Exams() {
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [exams, setExams] = useState<Exam[]>([]);
  const [questionBanks, setQuestionBanks] = useState([]);

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

  const [creating, setCreating] = useState(false);
  const [newExam, setNewExam] = useState<Exam>(emptyExam);

  useEffect(() => {
    const loadBanks = async () => {
      const data = getUserSession();
      const teacherId = data.id;
      if (!teacherId) return;

      try {
        const banks = await GetAllQuestionBankService(teacherId);
        setQuestionBanks(banks);
      } catch (err) {
        alert("Erro ao carregar bancos de questões");
      }
    };

    loadBanks();
  }, []);

  const handleCreate = async () => {
    if (
      !newExam.titulo ||
      !newExam.bimestre ||
      !newExam.quantidade_questoes ||
      !newExam.area ||
      !newExam.dia_a_ser_realizada ||
      !newExam.hora_a_ser_liberada ||
      !newExam.banco_questao_id ||
      newExam.turmas.length === 0 ||
      newExam.questoes_id.length === 0 ||
      !newExam.metodo_de_selecao_de_ap
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      const data = getUserSession();
      const teacherId = data.id;
      if (!teacherId) return;

      await CreateExamService(teacherId, newExam);

      setExams([...exams, { ...newExam, id: exams.length + 1 }]);
      setNewExam(emptyExam);
      setCreating(false);
    } catch (err) {
      alert("Erro ao criar a prova");
    }
  };

  const startEdit = (e: Exam) => {
    setNewExam({ ...e });
    setEditId(e.id ?? null);
    setEditing(true);
  };

  const handleEdit = () => {
    if (!editId) return;

    setExams((prev) =>
      prev.map((e) => (e.id === editId ? { ...newExam, id: editId } : e))
    );

    setNewExam(emptyExam);
    setEditing(false);
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/home?type=professor")}
      >
        ⬅ Voltar
      </button>

      <h1 className={styles.title}> Gerenciar Provas</h1>

      <button className={styles.newBtn} onClick={() => setCreating(true)}>
        + Nova Prova
      </button>

      {creating && (
        <ExamCreateForm
          newExam={newExam}
          setNewExam={setNewExam}
          handleCreate={handleCreate}
          close={() => setCreating(false)}
          questionBanks={questionBanks}
        />
      )}

      {editing && (
        <ExamCreateForm
          newExam={newExam}
          setNewExam={setNewExam}
          handleCreate={handleEdit}
          close={() => setEditing(false)}
          isEdit
          questionBanks={questionBanks}
        />
      )}

      <ExamTable
        exams={exams}
        handleDelete={handleDelete}
        startEdit={startEdit}
      />
    </div>
  );
}
