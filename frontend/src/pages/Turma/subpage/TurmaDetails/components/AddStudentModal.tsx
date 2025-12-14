import { useState } from "react";
import styles from "../TurmaDetails.module.css";
import { CreateStudentManuallyService } from "../../../../../api/services/student/CreateStudentManuallyService";


interface Props {
    idClass: number;
    onClose: () => void;
    reload: () => void;
    idCoordinator: string;
}

export default function AddStudentModal({ idClass, onClose, reload, idCoordinator }: Props) {
    const [nome, setNome] = useState("");
    const [matricula, setMatricula] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!nome || !matricula) {
            setError("Preencha nome e matrícula!");
            return;
        }

        const body = {
            nome,
            matricula: Number(matricula),
            turma_id: idClass
        };

        try {
            const response = await CreateStudentManuallyService(idCoordinator, body);
            console.log(response);
            if(response.Aluno === null) {
                setError("Aluno com essa matrícula já existe.");
                return;
            }
                
            reload();
            onClose();
        } catch (err: any) {
            setError(err.message || "Erro ao adicionar aluno.");
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalContainer}>
                <h2 className={styles.modalTitle}>Adicionar Aluno</h2>

                <label>Nome</label>
                <input
                    className={styles.selectInput}
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do aluno"
                />

                <label>Matrícula</label>
                <input
                    className={styles.selectInput}
                    type="number"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    placeholder="Número da matrícula"
                />

                {error && <p className={styles.errorMessage}>{error}</p>}

                <div className={styles.modalButtons}>
                    <button className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button className={styles.confirmBtn} onClick={handleSubmit}>Salvar</button>
                </div>
            </div>
        </div>
    );
}
