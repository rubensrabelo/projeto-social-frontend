import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Turmas.module.css";

// import TurmaFilters from "./components/TurmaFilters";
import TurmaCreateForm from "./components/TurmaForm";
import TurmasTable from "./components/TurmaTable";
import type { Turma } from "./types/TurmaType";

export default function Turmas() {
  const navigate = useNavigate();

  // const [filters, setFilters] = useState({ bimestre: "", disciplina: "" });

  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [turmas, setTurmas] = useState<Turma[]>([
    {
      _id: "1",
      ano: 2025,
      curso: "Informática",
      alunos: ["aluno1", "aluno2", "aluno3"],
      professores: ["prof1"],
    }
  ]);

  const emptyTurma: Turma = {
    ano: 0,
    curso: "",
    alunos: [],
    professores: [],
  };

  const [creating, setCreating] = useState(false);
  const [newTurma, setNewTurma] = useState<Turma>(emptyTurma);

  const handleCreate = () => {
    if (
      !newTurma.ano ||
      !newTurma.curso
    ) {
      alert("Preencha todos os campos.");
      return;
    }

    const newT: Turma = {
      ...newTurma,
      _id: (turmas.length + 1).toString(),
    };

    setTurmas([...turmas, newT]);
    setNewTurma(emptyTurma);
    setCreating(false);
  };

  const startEdit = (e: Turma) => {
    setNewTurma({ ...e });
    setEditId(e._id ?? null);
    setEditing(true);
  };

  const handleEdit = () => {
    if (!editId) return;

    setTurmas((prev) =>
      prev.map((e) => (e._id === editId ? { ...newTurma, _id: editId } : e))
    );

    setNewTurma(emptyTurma);
    setEditing(false);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    setTurmas((prev) => prev.filter((e) => e._id !== id));
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/home?type=coordenadores")}
      >
        ⬅ Voltar
      </button>

      <h1 className={styles.title}> Gerenciar Turmas</h1>

      <button className={styles.newBtn} onClick={() => setCreating(true)}>
        + Nova Turma
      </button>

      {creating && (
        <TurmaCreateForm
          newTurma={newTurma}
          setNewTurma={setNewTurma}
          handleCreate={handleCreate}
          close={() => setCreating(false)}
        />
      )}

      {editing && (
        <TurmaCreateForm
          newTurma={newTurma}
          setNewTurma={setNewTurma}
          handleCreate={handleEdit}
          close={() => setEditing(false)}
          isEdit
        />
      )}

      < TurmasTable
        turmas={turmas}
        handleDelete={handleDelete}
        startEdit={startEdit}
      />
    </div>
  );
}
