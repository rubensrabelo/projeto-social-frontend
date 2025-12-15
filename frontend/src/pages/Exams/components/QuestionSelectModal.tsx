import { useEffect, useState } from "react";
import styles from "../Exams.module.css";
import { getUserSession } from "../../../utils/session/getUserSession";
import { GetAllQuestionService } from "../../../api/services/questions/GetAllQuestionService";

interface Props {
  close: () => void;
  banks: any[];
  onConfirm: (questions: number[], bankId: number) => void;
}

export default function QuestionSelectModal({ close, banks, onConfirm }: Props) {
  const [selectedBank, setSelectedBank] = useState<number | "">("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const loadQuestions = async (bankId: number) => {
    const user = getUserSession();
    const data = await GetAllQuestionService(user.id, bankId);

    // Garantir que todos os IDs venham como number
    const normalized = data.map((q: any) => ({
      ...q,
      id: Number(q.id),
    }));

    setQuestions(normalized);
  };

  useEffect(() => {
    if (selectedBank !== "") {
      loadQuestions(Number(selectedBank));
    }
  }, [selectedBank]);

  const toggleSelect = (id: number | string) => {
    const numId = Number(id);
    setSelectedQuestions((prev) =>
      prev.includes(numId)
        ? prev.filter((q) => q !== numId)
        : [...prev, numId]
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3 className={styles.modalTitle}>Selecionar Questões</h3>

        <select
          value={selectedBank}
          onChange={(e) => {
            const v = e.target.value;
            setSelectedBank(v === "" ? "" : Number(v));
          }}
        >
          <option value="">Selecione um Banco</option>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.area}
            </option>
          ))}
        </select>

        <div className={styles.questionList}>
          {selectedBank === "" ? (
            <div className={styles.emptyState}>
              <p>Selecione um banco para visualizar as questões.</p>
            </div>
          ) : questions.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma questão cadastrada para este banco.</p>
            </div>
          ) : (
            questions.map((q) => {
              const qId = Number(q.id);

              return (
                <label key={qId} className={styles.questionItem}>
                  <div className={styles.questionHeader}>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(qId)}
                      onChange={() => toggleSelect(qId)}
                      className={styles.checkbox}
                    />
                    <span className={styles.questionText}>{q.enunciado}</span>
                  </div>

                  <span className={styles.difficultyBadge}>
                    {q.nivel_de_dificuldade}
                  </span>
                </label>
              );
            })
          )}
        </div>

        <div className={styles.modalActions}>
          <button
            className={`${styles.modalBtn} ${styles.modalCancel}`}
            onClick={close}
          >
            Cancelar
          </button>

          <button
            className={styles.modalBtn}
            onClick={() => onConfirm(selectedQuestions, Number(selectedBank))}
            disabled={selectedQuestions.length === 0}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
