import styles from "../Turmas.module.css";
import { useState } from "react";
import type { Professor } from "../types/ProfessorType";

interface Props {
  selected: Professor[];
  onSelect: (professores: Professor[]) => void;
  onClose: () => void;
}

export default function ProfessorModal({ selected, onSelect, onClose }: Props) {
  const [lista, setLista] = useState<Professor[]>(selected || []);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");

  const adicionar = () => {
    if (!nome || !matricula || !senha) return;

    const novoProfessor: Professor = {
      id: "0",
      nome,
      matricula: Number(matricula),
      senha,
    };

    setLista([...lista, novoProfessor]);
    setNome("");
    setMatricula("");
    setSenha("");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalScroll}>
          <h2 className={styles.modalTitle}>Adicionar Professores</h2>

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            type="number"
            placeholder="Matrícula"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button className={styles.modalSave} onClick={adicionar}>
            Adicionar
          </button>

          <h3>Professores adicionados:</h3>
          <ul>
            {lista.map((p) => (
              <li key={p.id}>
                {p.nome} — {p.matricula}
              </li>
            ))}
          </ul>

          <div className={styles.modalActions}>
            <button className={styles.modalCancel} onClick={onClose}>
              Cancelar
            </button>

            <button
              className={styles.modalSave}
              onClick={() => {
                onSelect(lista);
                onClose();
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}