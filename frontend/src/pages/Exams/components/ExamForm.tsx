import styles from "../Exams.module.css";
import type { Exam } from "../types/ExamsType";

interface Props {
  newExam: Exam;
  setNewExam: (e: Exam) => void;
  handleCreate: () => void;
  close: () => void;
  isEdit?: boolean;
}

export default function ExamCreateForm({
  newExam,
  setNewExam,
  handleCreate,
  close,
  isEdit = false,
}: Props) {
  const update = (field: keyof Exam, value: any) => {
    setNewExam({ ...newExam, [field]: value });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalScroll}>
          <h2 className={styles.modalTitle}>
            {isEdit ? "Editar Prova" : "Criar Nova Prova"}
          </h2>

          <input
            type="text"
            placeholder="Título"
            value={newExam.titulo}
            onChange={(e) => update("titulo", e.target.value)}
          />

          <input
            type="number"
            placeholder="Quantidade de Questões"
            value={newExam.quantidade_questoes || ""}
            onChange={(e) => update("quantidade_questoes", Number(e.target.value))}
          />

          <select
            value={newExam.bimestre}
            onChange={(e) => update("bimestre", e.target.value)}
          >
            <option value="">Bimestre</option>
            <option value="1º">1º</option>
            <option value="2º">2º</option>
            <option value="3º">3º</option>
            <option value="4º">4º</option>
          </select>

          <select
            value={newExam.area}
            onChange={(e) => update("area", e.target.value)}
          >
            <option value="">Disciplina</option>
            <option value="Matemática">Matemática</option>
            <option value="Biologia">Biologia</option>
            <option value="História">História</option>
            <option value="Geografia">Geografia</option>
            <option value="Física">Física</option>
            <option value="Química">Química</option>
            <option value="Português">Português</option>
            <option value="Inglês">Inglês</option>
            <option value="Espanhol">Espanhol</option>
            <option value="Sociologia">Sociologia</option>
            <option value="Filosofia">Filosofia</option>
            <option value="Artes">Artes</option>
            <option value="Educação Física">Educação Física</option>
          </select>

          <input
            type="date"
            placeholder="Dia a ser realizada"
            value={newExam.dia_a_ser_realizada}
            onChange={(e) => update("dia_a_ser_realizada", e.target.value)}
          />

          <input
            type="time"
            placeholder="Hora a ser liberada"
            value={newExam.hora_a_ser_liberada}
            onChange={(e) => update("hora_a_ser_liberada", e.target.value)}
          />

          <div className={styles.modalTitle}>
            <h5>Selecionar Turmas</h5>
            {/* TODO: Fetch turmas from API */}
            {/* {turmas?.map((turma) => (
              <label key={turma.id}>
              <input type="checkbox" value={turma.id} />
              {turma.nome}
              </label>
            ))} */}
            </div>

          <select
            value={newExam.banco_questao_id || ""}
            onChange={(e) => update("banco_questao_id", Number(e.target.value))}
          >
            <option value="">Banco de Questões</option>
          </select>

          <select
            value={newExam.metodo_de_selecao_de_ap}
            onChange={(e) => update("metodo_de_selecao_de_ap", e.target.value)}
          >
            <option value="">Método de Seleção de Questões</option>
            <option value="Manual">Manual</option>
            <option value="Aleatória">Aleatória</option>
          </select>

            {newExam.metodo_de_selecao_de_ap === "Manual" && (
            <div className={styles.modalTitle}>
              <h5>Selecionar Questões</h5>
              {/* TODO: Fetch e mapear questões do banco selecionado */}
              {/* {questoes?.map((questao) => (
            <label key={questao.id}>
            <input type="checkbox" value={questao.id} />
            {questao.titulo}
            </label>
              ))} */}
            </div>
            )}

            {newExam.metodo_de_selecao_de_ap === "Aleatória" && (
            <div className={styles.modalTitle}>
              <h5>Questões Selecionadas Aleatoriamente</h5>
              {/* TODO: Fetch e mapear questões aleatórias do banco selecionado */}
              {/* {questoes?.map((questao) => (
            <div key={questao.id}>
            <p>{questao.titulo}</p>
            </div>
              ))} */}
            </div>
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
