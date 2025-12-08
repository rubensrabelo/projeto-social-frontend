import { useEffect, useState } from "react";
import styles from "../Exams.module.css";
import type { Turma } from "../../Turma/types/TurmaType";
import { GetAllSchoolClassesService } from "../../../api/services/school-classes/GetAllSchoolClassesService";

interface Props {
  close: () => void;
  onConfirm: (turmasSelecionadas: number[]) => void;
}

export default function SchoolClassSelectModal({ close, onConfirm }: Props) {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);

  const loadClasses = async () => {
    const lista = await GetAllSchoolClassesService();
    setTurmas(lista);
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedClasses((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h3 className={styles.modalTitle}>Selecionar Turmas</h3>

        <div className={styles.questionList}>
          {turmas.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma turma cadastrada.</p>
            </div>
          ) : (
            turmas.map((t) => (
              <label key={t._id} className={styles.questionItem}>
                <div className={styles.questionHeader}>
                  <input
                    type="checkbox"
                    checked={selectedClasses.includes(Number(t._id))}
                    onChange={() => toggleSelect(Number(t._id))}
                    className={styles.checkbox}
                  />
                  <span className={styles.questionText}>
                    {t.curso} — {t.ano}
                  </span>
                </div>

                <span className={styles.difficultyBadge}>
                  {t.alunos.length} alunos
                </span>
              </label>
            ))
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
            onClick={() => onConfirm(selectedClasses)}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
