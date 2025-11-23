import styles from "../Questions.module.css";

interface Props {
  newQuestion: any;
  setNewQuestion: (v: any) => void;
  handleCreate: () => void;
  close: () => void;
  isEdit?: boolean;
}

export default function QuestionCreateForm({
  newQuestion,
  setNewQuestion,
  handleCreate,
  close,
  isEdit = false,
}: Props) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <h2 className={styles.modalTitle}>
          {isEdit ? "Editar Questão" : "Criar Nova Questão"}
        </h2>

        <input
          type="text"
          placeholder="Título"
          value={newQuestion.title}
          onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
        />

        <select
          value={newQuestion.year}
          onChange={(e) => setNewQuestion({ ...newQuestion, year: e.target.value })}
        >
          <option value="">Ano</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <select
          value={newQuestion.bimester}
          onChange={(e) => setNewQuestion({ ...newQuestion, bimester: e.target.value })}
        >
          <option value="">Bimestre</option>
          <option value="1º">1º</option>
          <option value="2º">2º</option>
          <option value="3º">3º</option>
          <option value="4º">4º</option>
        </select>

        <select
          value={newQuestion.subject}
          onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
        >
          <option value="">Disciplina</option>
          <option value="Matemática">Matemática</option>
          <option value="Biologia">Biologia</option>
          <option value="História">História</option>
          <option value="Geografia">Geografia</option>
        </select>

        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={close}>Cancelar</button>
          <button className={styles.modalSave} onClick={handleCreate}>
            {isEdit ? "Salvar Alterações" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
