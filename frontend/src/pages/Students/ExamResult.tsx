import { useLocation, useNavigate } from "react-router-dom";
import QuestionCard from "../Students/components/QuestionCard";
import styles from "./AnswerExamPage.module.css";
import type { Question } from "../Questions/types/QuestionType";

export default function ExamResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { questions, answers } = location.state;

  const correctCount = questions.filter((q: Question) => answers[q.id!] === q.correta).length;

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
            onSelect={(alt) => answers(q.id!, alt)}
          />
        ))}

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          Voltar
        </button>
      </div>

      {/*sidebar*/}

      <div className={styles.sidebar}>
        <div className={styles.progressCard}>
          <h3>Pontuação</h3>
          <p className={styles.progressCount}>
            {correctCount}/{questions.length}
          </p>

          <button 
            className={styles.finishBtn}
            onClick={() => navigate("/student")}
          >
            Finalizar
          </button>
        </div>
      </div>

    </div>
  );
}