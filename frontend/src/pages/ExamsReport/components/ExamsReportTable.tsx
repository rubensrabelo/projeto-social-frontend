import styles from "../ExamsReport.module.css";
import type { NotaAluno } from "../types/NotaAlunoType";

interface Props {
    notas_alunos: NotaAluno[],
    id_prova?: string
    id_turma?: number
}

export default function ExamsReportTable({ notas_alunos, id_turma, id_prova }: Props) {

    // verifica se existem notas disponíveis
    
    if (notas_alunos.length === 0 || id_turma === undefined || id_prova === "") {
        return (
            <div className={styles.textBody}>
            <h3>Não existem dados para a prova e turma selecionada</h3>
            </div>
        )
    }

    // Retorna a tabela apenas se existirem provas disponíveis
    return (
        <div className={styles.tableWrapper}>

            <table className={styles.table}>
                <thead>
                    <tr>
                    <th>Aluno</th>
                    <th>Matrícula</th>
                    <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {notas_alunos.map((n) => (
                    <tr key={n.matricula}>
                        <td>{n.nome}</td>
                        <td>{n.matricula}</td>
                        <td>{n.nota}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
