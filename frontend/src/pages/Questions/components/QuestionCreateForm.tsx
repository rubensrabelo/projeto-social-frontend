import styles from "../Questions.module.css";
import type { Question } from "../types/QuestionType";

interface Props {
  newQuestion: Question;
  setNewQuestion: (v: Question) => void;
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
  const update = (field: keyof Question, value: any) => {
    setNewQuestion({ ...newQuestion, [field]: value });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalScroll}>
          <h2 className={styles.modalTitle}>
            {isEdit ? "Editar Questão" : "Criar Nova Questão"}
          </h2>

          <input
            type="text"
            placeholder="Título"
            value={newQuestion.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <textarea
            className={styles.textarea}
            placeholder="Enunciado da questão"
            value={newQuestion.statement}
            onChange={(e) => update("statement", e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                update("imageFile", file);
                update("imagePreview", URL.createObjectURL(file));
              }
            }}
          />
          {newQuestion.imagePreview && (
            <img
              src={newQuestion.imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            />
          )}

          <select
            value={newQuestion.type}
            onChange={(e) => update("type", e.target.value as any)}
          >
            <option value="">Tipo de Questão</option>
            <option value="multiple">Múltipla Escolha</option>
            <option value="essay">Dissertativa</option>
          </select>

          <select
            value={newQuestion.year}
            onChange={(e) => update("year", e.target.value)}
          >
            <option value="">Ano</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <select
            value={newQuestion.bimester}
            onChange={(e) => update("bimester", e.target.value)}
          >
            <option value="">Bimestre</option>
            <option value="1º">1º</option>
            <option value="2º">2º</option>
            <option value="3º">3º</option>
            <option value="4º">4º</option>
          </select>

          <select
            value={newQuestion.subject}
            onChange={(e) => update("subject", e.target.value)}
          >
            <option value="">Disciplina</option>
            <option value="Matemática">Matemática</option>
            <option value="Biologia">Biologia</option>
            <option value="História">História</option>
            <option value="Geografia">Geografia</option>
          </select>

          {newQuestion.type === "multiple" && (
            <div className={styles.multipleBox}>
              <h4>Alternativas</h4>
              {["A", "B", "C", "D"].map((opt) => (
                <input
                  key={opt}
                  type="text"
                  placeholder={`Alternativa ${opt}`}
                  value={newQuestion.options?.[opt as "A" | "B" | "C" | "D"] ?? ""}
                  onChange={(e) =>
                    update("options", {
                      ...(newQuestion.options ?? { A: "", B: "", C: "", D: "" }),
                      [opt]: e.target.value,
                    })
                  }
                />
              ))}
              <select
                value={newQuestion.correct ?? ""}
                onChange={(e) => update("correct", e.target.value)}
              >
                <option value="">Alternativa Correta</option>
                {["A", "B", "C", "D"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          )}

          {newQuestion.type === "essay" && (
            <textarea
              className={styles.textarea}
              placeholder="Resposta esperada"
              value={newQuestion.answer ?? ""}
              onChange={(e) => update("answer", e.target.value)}
            />
          )}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={close}>
            Cancelar
          </button>
          <button className={styles.modalSave} onClick={handleCreate}>
            {isEdit ? "Salvar Alterações" : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}
