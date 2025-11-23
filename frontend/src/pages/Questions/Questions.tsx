import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Questions.module.css";

import QuestionsFilters from "./components/QuestionsFilters";
import QuestionCreateForm from "./components/QuestionCreateForm";
import QuestionsTable from "./components/QuestionsTable";

export default function Questions() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ year: "", area: "", subject: "" });

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);


  const [questions, setQuestions] = useState([
    { id: 1, year: "2024", bimester: "1º", title: "Funções Afim", subject: "Matemática" },
    { id: 2, year: "2023", bimester: "3º", title: "Fotossíntese", subject: "Biologia" },
  ]);

  const [creating, setCreating] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    year: "",
    bimester: "",
    subject: "",
  });

  const handleCreate = () => {
    if (!newQuestion.title || !newQuestion.year || !newQuestion.bimester || !newQuestion.subject) {
      alert("Preencha todos os campos.");
      return;
    }

    const newQ = { id: questions.length + 1, ...newQuestion };
    setQuestions([...questions, newQ]);

    setCreating(false);
    setNewQuestion({ title: "", year: "", bimester: "", subject: "" });
  };

  const startEdit = (question: any) => {
    setNewQuestion(question);
    setEditId(question.id);
    setEditing(true);
  };

  const handleEdit = () => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === editId ? { ...q, ...newQuestion } : q))
    );

    setEditing(false);
    setEditId(null);
    setNewQuestion({ title: "", year: "", bimester: "", subject: "" });
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate("/home?type=professor")}>
        ⬅ Voltar
      </button>

      <h1 className={styles.title}>Gerenciar Questões</h1>

      <QuestionsFilters
        filters={filters}
        setFilters={setFilters}
        openCreateForm={() => setCreating(true)}
      />

      {creating && (
        <QuestionCreateForm
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          handleCreate={handleCreate}
          close={() => setCreating(false)}
        />
      )}

      {editing && (
        <QuestionCreateForm
          newQuestion={newQuestion}
          setNewQuestion={setNewQuestion}
          handleCreate={handleEdit}
          close={() => setEditing(false)}
          isEdit={true}
        />
      )}

      <QuestionsTable
        questions={questions}
        handleDelete={handleDelete}
        startEdit={startEdit}
      />
    </div>
  );
}
