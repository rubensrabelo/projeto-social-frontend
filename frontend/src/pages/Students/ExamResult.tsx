import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../Students/components/QuestionCard";
import styles from "./AnswerExamPage.module.css";
import type { Question } from "../Questions/types/QuestionType";

export default function ExamResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Proteção contra refresh ou acesso direto
  if (!location.state) {
    return (
      <div className={styles.container}>
        <p>Resultado não disponível.</p>
        <button onClick={() => navigate("/student")}>
          Voltar
        </button>
      </div>
    );
  }
  const { questions, answers, nota } = location.state;

  return (
    <div className={styles.container}>
      
      <div className={styles.questionsArea}>
        <h2 className={styles.examTitle}>Resultado da Prova</h2>

        {questions.map((q: Question) => (
          <QuestionCard
            key={q.id}
            question={q}
            selected={answers[q.id!]}
            reviewMode={true}
            disabled = {true}
            onSelect={(alt) => answers(q.id!, alt)}
          />
        ))}

      </div>

      {/*sidebar*/}

      <div className={styles.sidebar}>
        <div className={styles.progressCard}>
          <h3>Pontuação</h3>
          <p className={styles.progressCount}>
            {nota.toFixed(1)}
          </p>

          <button 
            className={styles.finishBtn}
            onClick={() => navigate("/student")}
          >
            Finalizar Revisão
          </button>
        </div>
      </div>

    </div>
  );
}