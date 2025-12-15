import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";

import { GetAllQuestionBankService } from "../../api/services/QuestionBank/GetAllQuestionBankService";
import QuestionBankTable from "./components/QuestionBankTable";
import { getUserSession } from "../../utils/session/getUserSession";
import CreateBankModal from "./components/CreateBankModal";
import type { Bank } from "./types/BankType";
import { CreateBankService } from "../../api/services/QuestionBank/CreateBankService";
import { UpdateBankService } from "../../api/services/QuestionBank/UpdateBankService";
import { DeleteBankService } from "../../api/services/QuestionBank/DeleteBankService";
import ConfirmDialog from "../Questions/components/ConfirmDialog";

export default function QuestionBanks() {
  const emptybank: Bank = {
    id: undefined,
    bimestre: 0,
    ano: 0,
    area: "Matemática",
  };

  const [newBank, setNewBank] = useState<Bank>(emptybank)
  const [banks, setBanks] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deletingBank, setDeletingBank] = useState<Bank | null>(null);


  const [error, setError] = useState("");

  const navigate = useNavigate();

  const user = getUserSession();
  const id_professor = user?.id;

  useEffect(() => {
    async function loadBanks() {
      try {
        setError("");
        const data = await GetAllQuestionBankService(id_professor);
        if (Array.isArray(data)) {
          setBanks(data);
        } else {
          setBanks([]);
          setError("Formato inesperado recebido do servidor.");
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar bancos.");
      }
    }
    loadBanks();
  }, [id_professor]);

  // Cria o novo banco de questões
  async function handleCreate() {
    setError("");
    if (!newBank.bimestre || !newBank.ano) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const body = {
        bimestre: newBank.bimestre,
        ano: newBank.ano,
        area: newBank.area,
      };

      const created = await CreateBankService(id_professor, body);

      setBanks((prev) => [...prev, created]);
      setCreating(false);
      setNewBank(emptybank);

    } catch (err: any) {
      setError(err.message || "Erro ao criar banco.");
    }
  }
  // Edita o Banco de questões
  async function handleEdit() {
    setError("");
    const user = getUserSession()

    if (!newBank.bimestre || !newBank.ano) {
      setError("altere um  dos campos!");
      return;
    }

    try {
      const body = {
        bimestre: Number(newBank.bimestre),
        ano: Number(newBank.ano),
        area: newBank.area,
      };
      // atualiza o banco 
      const updated = await UpdateBankService(user.id, newBank.id!, body);
      // pega os valores atualizados
      const updatedBank = updated.banco_questoes


      setBanks(prev =>
        prev.map(b => (b.id === newBank.id ? updatedBank : b)) // atualiza o registro do banco localmente
      );
      setEditing(false);
      setNewBank(emptybank);

    } catch (err: any) {
      setError(err.message || "Erro ao editar o banco.");
    }
  };

  // Deleta um banco de questões
  function onDelete(bank: Bank) {
    setDeletingBank(bank); // guarda o banco que será deletado
    setDeleting(true);     // abre o modal de confirmação
  }

  async function handleDelete() {
    setError("");
    const user = getUserSession();
    if (!user?.id || !deletingBank) return;

    try {
      // Chama a API para deletar o banco
      await DeleteBankService(user.id, deletingBank.id!);

      // Atualiza a lista de bancos localmente sem recarregar a página
      setBanks(prev => prev.filter(b => b.id !== deletingBank.id));
      setDeleting(false)

    } catch (err: any) {
      alert(err.message || "Erro ao excluir banco.");
    }
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.backBtn}
        onClick={() => navigate("/home?type=professores")}
      >
        ⬅ Voltar
      </button>

      <h1 className={styles.title}>Bancos de Questões</h1>

      <button className={styles.createBtn} onClick={() => setCreating(true)}>
        + Criar Banco de Questões
      </button>

      <div className={styles.tableWrapper}>

        <QuestionBankTable banks={banks}
          onEdit={(bank: Bank) => {
            setNewBank({
              ...bank,
              bimestre: bank.bimestre,
              ano: bank.ano,
            });
            setEditing(true);
          }}
          onDelete={onDelete}
        />
        {banks.length === 0 && <p>Nenhum banco criado ainda.</p>}
      </div>

      {creating && (
        <CreateBankModal
          bank={newBank}
          setNewBank={setNewBank}
          handleSubmit={handleCreate}
          close={() => { setError(""), setCreating(false); setNewBank(emptybank) }}
          error={error}
          isEdit={false}
        />
      )}

      {editing && (
        <CreateBankModal
          bank={newBank}
          setNewBank={setNewBank}
          handleSubmit={handleEdit}
          close={() => { setError(""), setEditing(false); setNewBank(emptybank) }}
          error={error}
          isEdit={true}
        />
      )}
      {deleting && (
        <ConfirmDialog
          title="Excluir Banco de questões"
          message={"Tem certeza que deseja excluir esse banco? Esta operação é irreversível"}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(false)}
        />
      )}
    </div>
  );
}
