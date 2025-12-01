import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./QuestionBank.module.css";

import { createQuestionBank } from "../../api/services/QuestionBank/CreateQuestionBankService";
import { GetAllQuestionBankService } from "../../api/services/QuestionBank/GetAllQuestionBankService";
import QuestionBankCard from "./components/QuestionBankCard";
import { getUserSession } from "../../utils/session/getUserSession";

export default function QuestionBank() {
  const [banks, setBanks] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    bimestre: "",
    ano: "",
    area: "Matemática",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const user = getUserSession();
  const id_professor = user?.id;

  useEffect(() => {
    async function loadBanks() {
      try {
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate() {
    if (!form.bimestre || !form.ano || !form.area) {
      setError("Preencha todos os campos!");
      return;
    }

    try {
      const body = {
        bimestre: Number(form.bimestre),
        ano: Number(form.ano),
        area: form.area,
      };

      const created = await createQuestionBank(id_professor, body);

      setBanks((prev) => [...prev, created]);
      setCreating(false);
      setForm({ bimestre: "", ano: "", area: "Matemática" });

    } catch (err: any) {
      setError(err.message || "Erro ao criar banco.");
    }
  }

  function openQuestions(bank: any) {
    navigate("/questoes", {
      state: { bank }
    });
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

      <div className={styles.list}>
        {banks.length === 0 && <p>Nenhum banco criado ainda.</p>}
        {banks.map((b) => (
          <QuestionBankCard key={b.id} bank={b} onClick={() => openQuestions(b)} />
        ))}
      </div>

      {creating && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalBox}>
            <h2 className={styles.modalTitle}>Criar Banco de Questões</h2>

            <input
              name="ano"
              placeholder="Ano"
              type="number"
              value={form.ano}
              onChange={handleChange}
            />

            <input
              name="bimestre"
              placeholder="Bimestre"
              type="number"
              value={form.bimestre}
              onChange={handleChange}
            />

            <select
              name="area"
              value={form.area}
              onChange={handleChange}
            >
              <option value="Matemática">Matemática</option>
              <option value="Linguagens">Linguagens</option>
              <option value="Técnicas">Técnicas</option>
            </select>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setCreating(false)}>
                Cancelar
              </button>
              <button className={styles.modalSave} onClick={handleCreate}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
