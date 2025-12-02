import styles from "../Turmas.module.css";
import type { Turma } from "../types/TurmaType";

interface Props {
    turmas: Turma[];
    handleDelete: (id: string) => void;
    startEdit: (t: Turma) => void;
    handleDetails: (id: string) => void;
}

export default function TurmasTable({ turmas, handleDelete, startEdit, handleDetails }: Props) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Ano</th>
                        <th>Curso</th>
                        <th>Ir para configurações</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {turmas.map((e) => (
                        <tr key={e._id}>
                            <td>{e._id}</td>
                            <td>{e.ano}</td>
                            <td>{e.curso}</td>

                            <td>
                                <button
                                    className={styles.detailBtn}
                                    onClick={() => handleDetails(e._id!)}
                                >
                                    Configurações
                                </button>
                            </td>

                            <td>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => startEdit(e)}
                                >
                                    Editar
                                </button>

                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(e._id!)}
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
