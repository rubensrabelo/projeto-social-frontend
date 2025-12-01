import styles from "../Turmas.module.css";
import { useState } from "react";

interface Props {
  selected: string[];
  onSelect: (alunos: string[]) => void;
  onClose: () => void;
}
export default function AlunoModal({ selected, onSelect, onClose }: Props) {
  const [lista, setLista] = useState(selected || []);
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");

  const adicionar = () => {
    if (!nome || !matricula) return;
    setLista([...lista, `${nome} (${matricula})`]);
    setNome("");
    setMatricula("");
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalScroll}>
          <h2 className={styles.modalTitle}>Adicionar alunos</h2>

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

        <div className={styles.modalOptions}>
          <button className={styles.modalSave} onClick={adicionar}>Adicionar</button>
          <button className={styles.modalSave} onClick={() => {}}>Importar arquivo</button>
        </div>        

        <h3 className={styles.modalSubtitle}>Alunos adicionados:</h3>
        <ul className={styles.alunoList}>
          {lista.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>

        <div className={styles.modalActions}>
          <button className={styles.modalCancel} onClick={onClose}>Cancelar</button>

          <button className={styles.modalSave}
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