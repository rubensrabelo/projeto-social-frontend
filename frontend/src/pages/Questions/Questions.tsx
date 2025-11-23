import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Questions.module.css";

import QuestionsFilters from "./components/QuestionsFilters";
import QuestionCreateForm from "./components/QuestionCreateForm";
import QuestionsTable from "./components/QuestionsTable";
import type { Question } from "./types/QuestionType";

export default function Questions() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ year: "", area: "", subject: "" });

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      year: "2024",
      bimester: "1º",
      title: "Funções Afim",
      statement: "Explique o comportamento da função afim.",
      subject: "Matemática",
      type: "multiple",
      options: { A: "Cresce", B: "Decresce", C: "Constante", D: "Outro" },
      correct: "A",
    },
  ]);

  const emptyQuestion: Question = {
    id: null,
    title: "",
    statement: "",
    year: "",
    bimester: "",
    subject: "",
    type: "",
    options: { A: "", B: "", C: "", D: "" },
    correct: "",
    answer: "",
  };

  const [creating, setCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState<Question>(emptyQuestion);

  const handleCreate = () => {
    if (
      !newQuestion.title ||
      !newQuestion.statement ||
      !newQuestion.year ||
      !newQuestion.bimester ||
      !newQuestion.subject
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    const newQ: Question = {
      ...newQuestion,
      id: questions.length + 1,
    };

    setQuestions([...questions, newQ]);
    setNewQuestion(emptyQuestion);
    setCreating(false);
  };

  const startEdit = (q: Question) => {
    setNewQuestion({ ...q });
    setEditId(q.id ?? null);
    setEditing(true);
  };

  const handleEdit = () => {
    if (!editId) return;

    setQuestions((prev) =>
      prev.map((q) => (q.id === editId ? { ...newQuestion, id: editId } : q))
    );

    setNewQuestion(emptyQuestion);
    setEditing(false);
    setEditId(null);
  };

  const handleDelete = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/home?type=professor")}
      >
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
          isEdit
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
