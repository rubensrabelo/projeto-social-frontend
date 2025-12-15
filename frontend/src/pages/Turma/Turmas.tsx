import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Turmas.module.css";

import TurmaCreateForm from "./components/TurmaForm";
import TurmasTable from "./components/TurmaTable";
import type { Turma } from "./types/TurmaType";

import { GetAllSchoolClassesService } from "../../api/services/school-classes/GetAllSchoolClassesService";
import { CreateSchoolClassService } from "../../api/services/school-classes/CreateSchoolClassService";
import { UpdateSchoolClassService } from "../../api/services/school-classes/UpdateSchoolClassService";

import { getUserSession } from "../../utils/session/getUserSession";
import { DeleteSchoolClassService } from "../../api/services/school-classes/DeleteSchoolClassService";
import ConfirmDeleteTurma from "./components/ConfirmDialog";

export default function Turmas() {
  const navigate = useNavigate();

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [turmaToDelete, setTurmaToDelete] = useState<Turma | null>(null);

  const emptyTurma: Turma = {
    ano: 0,
    curso: "",
    alunos: [],
    professores: [],
  };

  const [newTurma, setNewTurma] = useState<Turma>(emptyTurma);
  const [error, setError] = useState<string>("")

  const user = getUserSession();

  const loadTurmas = async () => {
    const result = await GetAllSchoolClassesService();
    setTurmas(result);
  };

  useEffect(() => {
    loadTurmas();
  }, []);

  // CREATE
  const handleCreate = async () => {
    setError("");

    if (!newTurma.ano || !newTurma.curso) {
      setError("Preencha todos os campos.");
      return;
    }

    const payload = {
      turma: {
        ano: newTurma.ano,
        curso: newTurma.curso,
        alunos: [],
        professores: [],
      },
      professores_id: newTurma.professores || [],
    };

    await CreateSchoolClassService(user.id, payload);
    await loadTurmas();
    setCreating(false);
    setNewTurma(emptyTurma);
  };

  // EDIT
  const startEdit = (turma: Turma) => {
    setNewTurma(turma);
    setEditing(true);
  };

  const handleEdit = async () => {
    if (!newTurma._id) return alert("Erro: turma sem ID");

    const payload = {
      ano: newTurma.ano,
      curso: newTurma.curso
    };

    await UpdateSchoolClassService(user.id, Number(newTurma._id), payload);
    await loadTurmas();
    setEditing(false);
    setNewTurma(emptyTurma);
  };

  // DELETE
  const handleDelete = (turma: Turma) => {
    setTurmaToDelete(turma);
    setConfirmOpen(true);
  };

  async function confirmDeletion() {
    if (!turmaToDelete?._id) return;

    try {
      await DeleteSchoolClassService(user.id, Number(turmaToDelete._id));
      setTurmas(prev => prev.filter(t => t._id !== turmaToDelete._id));
    } catch (error) {
      alert("Erro ao deletar turma!");
    }

    setConfirmOpen(false);
    setTurmaToDelete(null);
  }


  // DETALHES
  const handleDetails = (id: number) => {
    navigate(`/turmas/${id}`);
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/home?type=coordenadores")}
      >
        ⬅ Voltar
      </button>

      <h1 className={styles.title}>Gerenciar Turmas</h1>

      <button className={styles.newBtn} onClick={() => setCreating(true)}>
        + Nova Turma
      </button>

      {creating && (
        <TurmaCreateForm
          newTurma={newTurma}
          setNewTurma={setNewTurma}
          handleSubmit={handleCreate}
          error={error}
          close={() => { setError(""), setCreating(false)}}
        />
      )}

      {editing && (
        <TurmaCreateForm
          newTurma={newTurma}
          setNewTurma={setNewTurma}
          handleSubmit={handleEdit}
          error={error}
          close={() => { setError(""), setEditing(false) }}
          isEdit
        />
      )}

      <TurmasTable
        turmas={turmas}
        handleDelete={handleDelete}
        startEdit={startEdit}
        handleDetails={handleDetails}
      />

      {confirmOpen && (
        <ConfirmDeleteTurma
          turmaNome={turmaToDelete?.curso}
          onConfirm={confirmDeletion}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

    </div>
  );
}
