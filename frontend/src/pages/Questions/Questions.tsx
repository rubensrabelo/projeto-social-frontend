import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Questions.module.css";

export default function Questions() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    year: "",
    area: "",
    subject: "",
  });

  const [questions, setQuestions] = useState([
    {
      id: 1,
      year: "2024",
      bimester: "1º",
      title: "Funções Afim",
      subject: "Matemática",
    },
    {
      id: 2,
      year: "2023",
      bimester: "3º",
      title: "Fotossíntese",
      subject: "Biologia",
    },
  ]);

  const [creating, setCreating] = useState(false);

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    year: "",
    bimester: "",
    subject: "",
  });

  const handleCreate = () => {
    if (!newQuestion.title || !newQuestion.year || !newQuestion.bimester || !newQuestion.subject) {
      alert("Preencha todos os campos.");
      return;
    }

    const newQ = {
      id: questions.length + 1,
      ...newQuestion,
    };

    setQuestions([...questions, newQ]);
    setCreating(false);
    setNewQuestion({ title: "", year: "", bimester: "", subject: "" });
  };

  const handleDelete = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <div className={styles.container}>

      {/* BOTÃO VOLTAR */}
      <button className={styles.backBtn} onClick={() => navigate("/home?type=professor")}>
        ⬅ Voltar
      </button>

      <h1 className={styles.title}>Gerenciar Questões</h1>

      {/* FILTROS */}
      <div className={styles.filters}>
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="">Ano</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>

        <select
          value={filters.area}
          onChange={(e) => setFilters({ ...filters, area: e.target.value })}
        >
          <option value="">Área</option>
          <option value="Ciências Humanas">Ciências Humanas</option>
          <option value="Ciências da Natureza">Ciências da Natureza</option>
          <option value="Matemática">Matemática</option>
          <option value="Linguagens">Linguagens</option>
        </select>

        <select
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
        >
          <option value="">Disciplina</option>
          <option value="Matemática">Matemática</option>
          <option value="Física">Física</option>
          <option value="Química">Química</option>
          <option value="Português">Português</option>
        </select>

        <button className={styles.newBtn} onClick={() => setCreating(true)}>
          + Nova Questão
        </button>
      </div>

      {/* FORM DE CRIAÇÃO */}
      {creating && (
        <div className={styles.createBox}>
          <h2>Criar Nova Questão</h2>

          <input
            type="text"
            placeholder="Título"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          />

          <select
            value={newQuestion.year}
            onChange={(e) => setNewQuestion({ ...newQuestion, year: e.target.value })}
          >
            <option value="">Ano</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <select
            value={newQuestion.bimester}
            onChange={(e) => setNewQuestion({ ...newQuestion, bimester: e.target.value })}
          >
            <option value="">Bimestre</option>
            <option value="1º">1º</option>
            <option value="2º">2º</option>
            <option value="3º">3º</option>
            <option value="4º">4º</option>
          </select>

          <select
            value={newQuestion.subject}
            onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
          >
            <option value="">Disciplina</option>
            <option value="Matemática">Matemática</option>
            <option value="Biologia">Biologia</option>
            <option value="História">História</option>
            <option value="Geografia">Geografia</option>
          </select>

          <div className={styles.createActions}>
            <button onClick={() => setCreating(false)}>Cancelar</button>
            <button onClick={handleCreate}>Salvar</button>
          </div>
        </div>
      )}

      {/* TABELA */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Ano</th>
              <th>Bimestre</th>
              <th>Título</th>
              <th>Disciplina</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {questions.map((q) => (
              <tr key={q.id}>
                <td>{q.id}</td>
                <td>{q.year}</td>
                <td>{q.bimester}</td>
                <td>{q.title}</td>
                <td>{q.subject}</td>
                <td>
                  <button className={styles.editBtn}>Editar</button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(q.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
