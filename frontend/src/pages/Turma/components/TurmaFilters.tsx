import styles from "../Turmas.module.css";

interface FiltersProps {
  // filters: { bimestre: string; disciplina: string};
  // setFilters: (v: any) => void;
  openCreateForm: () => void;
}

export default function TurmaFilters({ openCreateForm }: FiltersProps) {
  return (
    <div className={styles.filters}>
      {/* <select
        value={filters.bimestre}
        onChange={(e) => setFilters({ ...filters, bimestre: e.target.value })}
      >
        <option value="">Bimestre</option>
        <option value="1">1º Bimestre</option>
        <option value="2">2º Bimestre</option>
        <option value="3">3º Bimestre</option>
        <option value="4">4º Bimestre</option>
      </select> */}

      {/* <select
        value={filters.disciplina}
        onChange={(e) => setFilters({ ...filters, disciplina: e.target.value })}
      >
        <option value="">Disciplina</option>
        <option value="Matemática">Matemática</option>
        <option value="Física">Física</option>
        <option value="Química">Química</option>
        <option value="Português">Português</option>
        <option value="Inglês">Inglês</option>
        <option value="Espanhol">Espanhol</option>
        <option value="Biologia">Biologia</option>
        <option value="Geografia">Geografia</option>
        <option value="Sociologia">Sociologia</option>
        <option value="Filosofia">Filosofia</option>
        <option value="História">História</option>
        <option value="Artes">Artes</option>
        <option value="Educação Física">Educação Física</option>
      </select> */}

      <button className={styles.newBtn} onClick={openCreateForm}>
        + Nova Turma
      </button>
    </div>
  );
}
