import { useEffect, useState } from "react";
import styles from "./AnswerExamPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "././components/QuestionCard"
import type { Question } from "../Questions/types/QuestionType";
import { GetExamByIdService } from "../../api/services/student/GetExamsService";
import { GetQuestionExamService } from "../../api/services/student/GetQuestionsExamService";
import ConfirmDialog from "../Questions/components/ConfirmDialog";


export default function AnswerExamPage() {
  const { examId, professorId, bankId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 minutos

  // Chamar a API para buscar as questões da prova
  useEffect(() => {
    async function fetchQuestions() {
      if (!professorId || !bankId || !examId) return;

      const examData = await GetExamByIdService(professorId, examId);
      const questionIds = examData.questoes_id || [];

      // carrega as questões em paralelo
      const questionsData = await Promise.all(
        questionIds.map((qid : number) =>
          GetQuestionExamService(professorId, Number(bankId), qid)
        )
      );

      // seta uma vez só
      setQuestions(questionsData);
    }

    fetchQuestions();
  }, [professorId, bankId, examId]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const handleSelect = (qid: number, letra: string) => {
    setAnswers({ ...answers, [qid]: letra });
  };

  const formatTime = (sec: number) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const finalize = () => {
    navigate(`/student/examResult/${examId}`, {
      state: {
        questions,
        answers
      }
    });
  };

  return (
    <div className={styles.container}>

      {/* BLOCO DE QUESTÕES */}
      <div className={styles.questionsArea}>
        <h2 className={styles.examTitle}>Prova de Matemática 1</h2>

        {questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              selected={answers[q.id!]}
              onSelect={(alt) => handleSelect(q.id!, alt)}
            />
          ))}

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Anterior
        </button>
      </div>

      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.progressCard}>
          <h3>Progresso</h3>
          <p className={styles.progressCount}>
            {Object.keys(answers).length}/{questions.length}
          </p>

          <h3>Tempo Restante</h3>
          <p className={styles.timer}>{formatTime(timeLeft)}</p>

          <button className={styles.finishBtn} onClick={() =>setConfirmOpen(true)}>
            Finalizar prova
          </button>

          {confirmOpen && (
            <ConfirmDialog
              title="Finalizar prova"
              message="Tem certeza que deseja finalizar a prova? Confira suas respostas antes de confirmar"
              onConfirm={finalize}
              onCancel={() => setConfirmOpen(false)}
            />
          )}
        </div>
      </div>

    </div>
  );
}