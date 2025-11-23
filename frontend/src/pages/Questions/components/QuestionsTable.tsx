import styles from "../Questions.module.css";

interface Question {
    id: number;
    year: string;
    bimester: string;
    title: string;
    subject: string;
}

interface Props {
    questions: Question[];
    handleDelete: (id: number) => void;
    startEdit: (q: Question) => void;
}

export default function QuestionsTable({ questions, handleDelete, startEdit }: Props) {
    return (
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
                                <button 
                                    className={styles.editBtn}
                                    onClick={() => startEdit(q)}
                                >
                                    Editar
                                </button>
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
    );
}
