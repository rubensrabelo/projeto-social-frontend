import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import QuestionCreateForm from "./components/QuestionCreateForm";
import QuestionsTable from "./components/QuestionsTable";
import ConfirmDialog from "./components/ConfirmDialog";

import type { Question } from "./types/QuestionType";
import styles from "./Questions.module.css";

import { GetAllQuestionService } from "../../api/services/questions/GetAllQuestionService";
import { CreateQuestionService } from "../../api/services/questions/CreateQuestionService";
import { DeleteQuestionService } from "../../api/services/questions/DeletelQuestionService";
import { UpdateQuestionService } from "../../api/services/questions/UpdateQuestionService";
import { GetQuestionService } from "../../api/services/questions/GetQuestionService";

export default function Questions() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const bank = state?.bank;

  function getEmptyQuestion(): Question {
    return {
      id: null,
      enunciado: "",
      alternativa_a: "",
      alternativa_b: "",
      alternativa_c: "",
      alternativa_d: "",
      alternativa_e: "",
      materia: "",
      correta: "",
      banco_questao_id: bank?.id ?? 0,
      nivel_de_dificuldade: ""
    };
  }

  const [questions, setQuestions] = useState<Question[]>([]);
  const [question, setQuestion] = useState<Question>(getEmptyQuestion());

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!bank) return;

    async function fetchData() {
      try {
        const result = await GetAllQuestionService(
          bank.professor_id,
          bank.id
        );
        setQuestions(result);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [bank]);

  async function handleCreate() {
    setError("");

    if (!question.enunciado || !question.correta) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await CreateQuestionService(
        bank.professor_id,
        bank.id,
        { ...question, banco_questao_id: bank.id }
      );

      const result = await GetAllQuestionService(
        bank.professor_id,
        bank.id
      );
      setQuestions(result);

      setQuestion(getEmptyQuestion());
      setCreating(false);
    } catch (err) {
      setError("Erro ao criar questão.");
    }
  }

  async function handleEdit(selectedQuestion: Question) {
    if (!selectedQuestion.id) return;

    try {
      const fullQuestion = await GetQuestionService(
        bank.professor_id,
        bank.id,
        Number(selectedQuestion.id)
      );

      setQuestion(fullQuestion);
      setEditing(true);
    } catch (err) {
      alert("Erro ao carregar a questão.");
    }
  }

  async function handleUpdate() {
    if (!question.id) return;

    setError("");

    if (!question.enunciado || !question.correta) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      enunciado: question.enunciado,
      alternativa_a: question.alternativa_a,
      alternativa_b: question.alternativa_b,
      alternativa_c: question.alternativa_c,
      alternativa_d: question.alternativa_d,
      alternativa_e: question.alternativa_e,
      correta: question.correta,
      materia: question.materia,
      nivel_de_dificuldade: question.nivel_de_dificuldade
    };

    try {
      await UpdateQuestionService(
        bank.professor_id,
        bank.id,
        Number(question.id),
        payload
      );

      const result = await GetAllQuestionService(
        bank.professor_id,
        bank.id
      );
      setQuestions(result);

      setQuestion(getEmptyQuestion());
      setEditing(false);
    } catch (err) {
      setError("Erro ao atualizar questão.");
    }
  }

  function handleDelete(question: Question) {
    setQuestionToDelete(question);
    setConfirmOpen(true);
  }

  async function confirmDeletion() {
    if (!questionToDelete) return;

    try {
      await DeleteQuestionService(
        bank.professor_id,
        Number(questionToDelete.id)
      );

      setQuestions(prev =>
        prev.filter(q => q.id !== questionToDelete.id)
      );
    } catch (err) {
      alert("Erro ao deletar questão.");
    }

    setConfirmOpen(false);
    setQuestionToDelete(null);
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/banco_de_questoes")}
      >
        ⬅ Voltar
      </button>

      <h1>Gerenciar Questões</h1>

      <button
        className={styles.createBtn}
        onClick={() => {
          setQuestion(getEmptyQuestion());
          setCreating(true);
        }}
      >
        + Criar Questão
      </button>

      <div className={styles.tableWrapper}>
        <QuestionsTable
          questions={questions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {creating && (
        <QuestionCreateForm
          question={question}
          setQuestion={setQuestion}
          handleSubmit={handleCreate}
          close={() => {setError(""), setCreating(false)}}
          error={error}
        />
      )}

      {editing && (
        <QuestionCreateForm
          question={question}
          setQuestion={setQuestion}
          handleSubmit={handleUpdate}
          close={() => {setError(""), setEditing(false)}}
          error={error}
          isEdit
        />
      )}

      {confirmOpen && (
        <ConfirmDialog
          title="Excluir questão"
          message={`Tem certeza que deseja excluir a questão?\n\n"${questionToDelete?.enunciado}"`}
          onConfirm={confirmDeletion}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
