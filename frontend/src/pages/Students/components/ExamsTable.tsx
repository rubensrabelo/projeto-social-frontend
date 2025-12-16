import { useNavigate } from "react-router-dom";
import styles from "../../Students/StudentsHome.module.css";
import type { Exam } from "../../Students/types/ExamsType";
import { GetGabaritoService } from "../../../api/services/gabaritos/GetGabaritosService";
import type { Aluno } from "../../Turma/types/AlunoType";
import { useState, useEffect } from "react";

interface Props {
    exams: Exam[],
    student? : Aluno
}

async function isExamAvailable(exam: Exam, student_matriculation: number): Promise<boolean> {
    const currentDate = new Date()

    const examDate = new Date(exam.dia_a_ser_realizada)

    const examsFinisheds = (await GetGabaritoService(student_matriculation)) ?? []
    
    // Verifica se a prova esta disponível
    for (const {avaliacao_id, matricula_aluno} of examsFinisheds) {
        if(exam._id === avaliacao_id && student_matriculation === matricula_aluno) return false
    }
    if(currentDate < examDate) return false

    return true
}

export default function ExamsTable({ exams, student }: Props) {

    // estado para verificar a disponibilidade da prova
    const [availableExams, setAvailableExams] = useState<Exam[]>([])

    useEffect(() => {
        if (!student?.matricula || exams.length === 0) return

        async function filterAvailableExams() {
            const disponiveis: Exam[] = []

            for (const exam of exams) {
            const isAvailable = await isExamAvailable(
                exam,
                student!.matricula
            )

            if (isAvailable) {
                disponiveis.push(exam)
            }
            }

            setAvailableExams(disponiveis)
        }

        filterAvailableExams()
        }, [exams, student?.matricula])


    const navigate = useNavigate();

    
    if (availableExams.length === 0) {
        return (
            <div className={styles.textBody}>
            <h3>Nenhuma prova disponível no momento</h3>
            <p>Aguarde a liberação de novas avaliações.</p>
            </div>
        )
    }

    // Retorna a tabela apenas se existirem provas disponíveis
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Bimestre</th>
                        <th>Quantidade de Questões</th>
                        <th>Data</th>
                        <th>Horário de liberação</th>
                        <th>Ações</th>
                    </tr>
                </thead>

                <tbody>
                    {availableExams.map((e) => (
                        <tr key={e._id}>
                            <td>{e.titulo}</td>
                            <td>{e.bimestre}</td>
                            <td>{e.quantidade_questoes}</td>
                            <td>{e.dia_a_ser_realizada}</td>
                            <td>{e.hora_a_ser_liberada}</td>
                            <td>
                                <button 
                                className={styles.answerBtn}
                                onClick={() => navigate(`/student/answerExam/${e._id}/${e.professor_id}`)}
                               >
                                    Iniciar Prova
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
