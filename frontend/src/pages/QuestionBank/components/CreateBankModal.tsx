import styles from "../QuestionBank.module.css";
// import type { BankFormData } from "../types/BankFormDataType";

import type { Bank } from "../types/BankType";

interface props {
    bank: Bank;
    setNewBank: (b: Bank) => void;
    handleSubmit: () => void;
    close: () => void;
    error: string;
    isEdit?: boolean;
}

export default function CreateBankModal({
    bank,
    setNewBank,
    handleSubmit,
    close,
    error,
    isEdit = false
}: props) {
    const update = <K extends keyof Bank>(field: K, value: Bank[K]) => {
        setNewBank({ ...bank, [field]: value });
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <div className={styles.modalScroll}>
                    <h2 className={styles.modalTitle}>
                        {isEdit ? "Editar Banco" : "Criar Banco"}
                    </h2>

                    <label htmlFor="select_serie" className={styles.label}>
                        Selecione a Série:
                    </label>
                    <select
                        id="select_serie"
                        name="ano"
                        value={bank.ano || ""}
                        onChange={(e) => update("ano", Number(e.target.value))}
                    >
                        <option value="" disabled>Escolha a Série</option>
                        <option value={1}>1° Ano</option>
                        <option value={2}>2° Ano</option>
                        <option value={3}>3° Ano</option>
                    </select>

                    <label htmlFor="select_bimestre" className={styles.label}>
                        Selecione o Bimestre:
                    </label>
                    <select
                        id="select_bimestre"
                        name="bimestre"
                        value={bank.bimestre || ""}
                        onChange={(e) => update("bimestre", Number(e.target.value))}
                    >
                        <option value="" disabled>Escolha o bimestre</option>
                        <option value={1}>1° Bimestre</option>
                        <option value={2}>2° Bimestre</option>
                        <option value={3}>3° Bimestre</option>
                        <option value={4}>4° Bimestre</option>
                    </select>

                    <label htmlFor="select_area" className={styles.label}>
                        Selecione a Área:
                    </label>
                    <select
                        id="select_area"
                        name="area"
                        value={bank.area || ""}
                        onChange={(e) => update("area", e.target.value)}
                    >
                        <option value="" disabled>Escolha uma Área</option>
                        <option value="Matemática">Matemática</option>
                        <option value="Linguagens">Linguagens</option>
                        <option value="Base Técnica">Base Técnica</option>
                        <option value="Ciências Humanas">Ciências Humanas</option>
                        <option value="Ciências da Natureza">Ciências da Natureza</option>
                    </select>

                    {error && <p className={styles.errorMessage}>{error}</p>}

                    <div className={styles.modalActions}>
                        <button className={styles.modalCancel} onClick={close}>
                            Cancelar
                        </button>
                        <button className={styles.modalSave} onClick={handleSubmit}>
                            {isEdit ? "Salvar Alterações" : "Criar Banco"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}