import { useState } from "react";
import styles from "../Exams.module.css";
import type { Exam } from "../types/ExamsType";

import QuestionSelectModal from "./QuestionSelectModal";
import SchoolClassSelectModal from "./SchoolClassSelectModal";

interface Props {
  newExam: Exam;
  setNewExam: (e: Exam) => void;
  handleCreate: () => void;
  close: () => void;
  error: string;
  isEdit?: boolean;
  questionBanks: any[];
}

export default function ExamCreateForm({
  newExam,
  setNewExam,
  handleCreate,
  close,
  error,
  isEdit = false,
  questionBanks,
}: Props) {
  const [modalQuestionsOpen, setModalQuestionsOpen] = useState(false);
  const [modalClassesOpen, setModalClassesOpen] = useState(false);

  const update = (field: keyof Exam, value: any) => {
    setNewExam({
      ...newExam,
      [field]: value,
    });
  };

  // ✅ CORRIGIDO: atualiza os dois campos em um único setNewExam
  const handleQuestionsSelected = (questionsIds: number[], bankId: number) => {
    setNewExam({
      ...newExam,
      banco_questao_id: bankId,
      questoes_id: questionsIds,
    });

    setModalQuestionsOpen(false);
  };

  const handleClassesSelected = (classIds: number[]) => {
    setNewExam({
      ...newExam,
      turmas: classIds,
    });

    setModalClassesOpen(false);
  };

  return (
    <div className={styles.formPage}>
      <h2 className={styles.formTitle}>
        {isEdit ? "Editar Prova" : "Criar Nova Prova"}
      </h2>

      {/* Título */}
      <input
        type="text"
        placeholder="Título"
        value={newExam.titulo}
        onChange={(e) => update("titulo", e.target.value)}
      />

      {/* Qtd questões */}
      <input
        type="number"
        placeholder="Quantidade de Questões"
        value={newExam.quantidade_questoes || ""}
        onChange={(e) =>
          update("quantidade_questoes", Number(e.target.value))
        }
      />

      {/* Bimestre */}
      <select
        value={newExam.bimestre}
        onChange={(e) => update("bimestre", Number(e.target.value))}
      >
        <option value="">Bimestre</option>
        <option value={1}>1º</option>
        <option value={2}>2º</option>
        <option value={3}>3º</option>
        <option value={4}>4º</option>
      </select>

      {/* Área */}
      <select
        value={newExam.area}
        onChange={(e) => update("area", e.target.value)}
      >
        <option value="">Disciplina</option>
        <option value="Matemática">Matemática</option>
        <option value="Linguagens">Linguagens</option>
        <option value="Técnicas">Técnicas</option>
      </select>

      {/* Data */}
      <input
        type="date"
        value={newExam.dia_a_ser_realizada}
        onChange={(e) => update("dia_a_ser_realizada", e.target.value)}
      />

      {/* Hora */}
      <input
        type="time"
        value={newExam.hora_a_ser_liberada}
        onChange={(e) => update("hora_a_ser_liberada", e.target.value)}
      />

      {/* Botão para modal de questões */}
      <button
        className={styles.openModalBtn}
        onClick={() => setModalQuestionsOpen(true)}
      >
        Selecionar Questões
      </button>

      {/* Botão para modal de turmas */}
      <button
        className={styles.openModalBtn}
        onClick={() => setModalClassesOpen(true)}
      >
        Selecionar Turmas
      </button>

      {/* Lista de questões selecionadas */}
      {newExam.questoes_id.length > 0 && (
        <div className={styles.selectedContainer}>
          <h4>Questões Selecionadas:</h4>
          {newExam.questoes_id.map((q) => (
            <p key={q}>Questão #{q}</p>
          ))}
        </div>
      )}

      {/* Lista de turmas selecionadas */}
      {newExam.turmas.length > 0 && (
        <div className={styles.selectedContainer}>
          <h4>Turmas Selecionadas:</h4>
          {newExam.turmas.map((t) => (
            <p key={t}>Turma #{t}</p>
          ))}
        </div>
      )}

      {error && <p className={styles.errorMessage}>{error}</p>}

      <div className={styles.formActions}>
        <button className={styles.cancelBtn} onClick={close}>
          Cancelar
        </button>

        <button className={styles.saveBtn} onClick={handleCreate}>
          {isEdit ? "Salvar Alterações" : "Salvar"}
        </button>
      </div>

      {/* Modal Questões */}
      {modalQuestionsOpen && (
        <QuestionSelectModal
          close={() => setModalQuestionsOpen(false)}
          banks={questionBanks}
          onConfirm={handleQuestionsSelected}
        />
      )}

      {/* Modal Turmas */}
      {modalClassesOpen && (
        <SchoolClassSelectModal
          close={() => setModalClassesOpen(false)}
          onConfirm={handleClassesSelected}
        />
      )}
    </div>
  );
}
