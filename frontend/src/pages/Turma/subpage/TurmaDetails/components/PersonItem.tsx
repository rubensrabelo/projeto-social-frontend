import { useEffect, useState } from "react";
import styles from "../TurmaDetails.module.css";
import { GetStudentByIdService } from "../../../../../api/services/student/GetStudentByIdService";
import { GetTeacherByIdService } from "../../../../../api/services/teacher/GetTeacherByIdService";

interface PersonItemProps {
    id: string;
    type: "aluno" | "professor";
    data?: any;
}

export default function PersonItem({ id, type, data }: PersonItemProps) {
    const [info, setInfo] = useState<any>(data || null);
    const [loading, setLoading] = useState(type === "aluno");

    useEffect(() => {
        async function load() {
            setLoading(true);

            try {
                if (type === "aluno") {
                    const student = await GetStudentByIdService(id);
                    setInfo(student);
                }

                if (type === "professor") {
                    const teacher = await GetTeacherByIdService(id);
                    setInfo(teacher);
                }
            } catch (_) {
                setInfo({
                    nome: type === "aluno"
                        ? "Aluno não encontrado"
                        : "Professor não encontrado",
                    matricula: "--",
                });
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id, type]);


    if (loading) return <li className={styles.personItem}>Carregando aluno...</li>;

    return (
        <li className={styles.personItem}>
            <div className={styles.personCard}>
                <p className={styles.personName}>
                    <strong>{info?.nome}</strong>
                </p>
                <p className={styles.personDetails}>Matrícula: {info?.matricula}</p>
            </div>
        </li>
    );
}
