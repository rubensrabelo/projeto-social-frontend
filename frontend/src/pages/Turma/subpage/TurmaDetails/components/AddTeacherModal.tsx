import { useEffect, useState } from "react";
import styles from "../TurmaDetails.module.css";
import { GetAllTeacherService } from "../../../../../api/services/teacher/GetAllTeacherService";
import { AddTeacherInSchoolClassService } from "../../../../../api/services/teacher/AddTeacherInSchoolClassService";
import { getUserSession } from "../../../../../utils/session/getUserSession";

interface Props {
    idClass: number;
    onClose: () => void;
    reload: () => void;
}

export default function AddTeacherModal({ idClass, onClose, reload }: Props) {
    const data = getUserSession();
    const coordinatorId = data.id;

    const [teachers, setTeachers] = useState<any[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const load = async () => {
            const data = await GetAllTeacherService(coordinatorId);
            setTeachers(data);
        };
        load();
    }, [coordinatorId]);

    const handleAdd = async () => {
        if (!selectedTeacher) return setError("Selecione um professor");

        console.log(idClass, coordinatorId, {
            selectedTeacher,
        });

        await AddTeacherInSchoolClassService(idClass, coordinatorId, [selectedTeacher]);

        reload();
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <h2 className={styles.modalTitle}>Adicionar Professor</h2>

                <select
                    className={styles.selectInput}
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                >
                    <option value="">Selecione...</option>
                    {teachers.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                            {prof.nome}
                        </option>
                    ))}
                </select>

                {error && <p className={styles.errorMessage}>{error}</p>}

                <div className={styles.modalButtons}>
                    <button className={styles.confirmBtn} onClick={handleAdd}>
                        Adicionar
                    </button>

                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
