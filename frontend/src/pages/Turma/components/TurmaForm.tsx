import styles from "../Turmas.module.css";
import type { Turma } from "../types/TurmaType";
// import { useState } from "react";
// import AlunoModal from "./AlunoModal"
// import ProfessorModal from "./ProfessorModal"

interface Props {
  newTurma: Turma;
  setNewTurma: (e: Turma) => void;
  handleCreate: () => void;
  close: () => void;
  isEdit?: boolean;
}

export default function TurmaCreateForm({
  newTurma,
  setNewTurma,
  handleCreate,
  close,
  isEdit = false,
}: Props) {
  const update = (field: keyof Turma, value: any) => {
    setNewTurma({ ...newTurma, [field]: value });
  };

  // const [abrirAlunoModal, setAbrirAlunoModal] = useState(false);
  // const [abrirProfessorModal, setAbrirProfessorModal] = useState(false);

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

          {/* Adicioanar Alunos e professores */}
          {/* <button className={styles.modalSave} onClick={() => setAbrirAlunoModal(true)}>
              Adicionar Alunos
          </button>
          <button className={styles.modalSave} onClick={()=> setAbrirProfessorModal(true)}>
              Adicionar professores
          </button> */}
          
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
{/* 
      {abrirAlunoModal && (
          <AlunoModal
            selected={newTurma.alunos}
            onSelect={(alunos) => update("alunos", alunos)}
            onClose={() => setAbrirAlunoModal(false)}
          />
        )}

      {abrirProfessorModal && (
          <ProfessorModal
            selected={newTurma.professores as any}
            onSelect={(professores) => update("professores", professores)}
            onClose={() => setAbrirProfessorModal(false)}
          />
        )} */}

    </div>
  );
}
