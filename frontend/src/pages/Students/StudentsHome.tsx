import styles from "./StudentsHome.module.css";
import { useEffect, useState } from "react";
import ExamsTable from "./components/ExamsTable";
import type { Exam } from "./types/ExamsType";
import { getUserSession } from "../../utils/session/getUserSession";
import { GetExamsService } from "../../api/services/student/GetExamsService";

export default function StudentsHome() {
    
    const student = getUserSession();
    // console.log(student);

    const [exams, setExams] = useState<Exam[]>([]);

    useEffect(() => {
        async function loadExams() {
            try {
                const examsData = await GetExamsService(student._id);
                console.log(examsData);

                // Pegando somente o array de provas
                setExams(examsData);
            } catch (error) {
                console.error("Erro ao carregar provas:", error);
            }
    }

        loadExams();
    }, []);

    return (
        <div className={styles.container}>

            <h1 className={styles.title}>Bem vindo(a) {student.nome}</h1>
            <h2 className={styles.subtitle}>Provas disponíveis</h2>


            <ExamsTable
            exams={exams}
            />
        </div>
    );
}