import styles from "../Turmas.module.css";
import type { Turma } from "../types/TurmaType";

interface Props {
  newTurma: Turma;
  setNewTurma: (e: Turma) => void;
  handleSubmit: () => void;
  error: string;
  close: () => void;
  isEdit?: boolean;
}

export default function TurmaCreateForm({
  newTurma,
  setNewTurma,
  handleSubmit,
  error,
  close,
  isEdit = false,
}: Props) {
  const update = (field: keyof Turma, value: any) => {
    setNewTurma({ ...newTurma, [field]: value });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalScroll}>
          <h2 className={styles.modalTitle}>
            {isEdit ? "Editar Turma" : "Criar Nova Turma"}
          </h2>

          {/* Ano */}
          <input
            type="number"
            placeholder="Ano"
            value={newTurma.ano || ""}
            onChange={(e) => update("ano", Number(e.target.value))}
          />

          {/* Curso */}
          <select
            value={newTurma.curso}
            onChange={(e) => update("curso", e.target.value)}
          >
            <option value="">Selecione um curso</option>
            <option value="Administração">Administração</option>
            <option value="Agronegócio">Agronegócio</option>
            <option value="Desenvolvimento de Sistemas">Desenvolvimento de Sistemas</option>
            <option value="Enfermagem">Enfermagem</option>
            <option value="Informática">Informática</option>
          </select>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={close}>
            Cancelar
          </button>

          <button className={styles.modalSave} onClick={handleSubmit}>
            {isEdit ? "Salvar Alterações" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
