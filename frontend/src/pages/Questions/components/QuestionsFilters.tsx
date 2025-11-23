import styles from "../Questions.module.css";

interface FiltersProps {
  filters: { year: string; area: string; subject: string };
  setFilters: (v: any) => void;
  openCreateForm: () => void;
}

export default function QuestionsFilters({ filters, setFilters, openCreateForm }: FiltersProps) {
  return (
    <div className={styles.filters}>
      <select
        value={filters.year}
        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
      >
        <option value="">Série</option>
        <option value="1">1º Ano</option>
        <option value="2">2º Ano</option>
        <option value="3">3º Ano</option>
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
        <option value="Base Técnica">Base Técnica</option>
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

      <button className={styles.newBtn} onClick={openCreateForm}>
        + Nova Questão
      </button>
    </div>
  );
}
