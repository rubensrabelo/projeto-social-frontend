import styles from "./ExamsReport.module.css";
import { useEffect, useState, useMemo } from "react";
import ExamsReportTable from "./components/ExamsReportTable";
import type { Exam } from "./types/ExamsType";
import type { NotaAluno } from "./types/NotaAlunoType";
import { getUserSession } from "../../utils/session/getUserSession";
import { GetAllExamesService } from "../../api/services/exams/GetAllExamsService";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GetNotasByTurmaService } from "../../api/services/ExamReports/GetNotasByTurmaService";
import { GetAllSchoolClassesService } from "../../api/services/school-classes/GetAllSchoolClassesService";

export default function ExamsReport() {
    
    const user = getUserSession();
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const type_user = searchParams.get("type")

    const [exams, setExams] = useState<Exam[]>([]);
    const [selectedExamId, setSelectedExamId] = useState<string>("");
    const [turmas, setTurmas] = useState<{_id:number, curso:string, ano:number}[]>([]);
    const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
    const [notas, setNotas] = useState<NotaAluno[]>([]);
    // pega as provas do professor
    useEffect(() => {
        async function loadExams() {
            if (type_user !== "professores") return;
            try {
                const examsData = await GetAllExamesService(user.id);
                // Pegando somente o array de provas
                setExams(examsData);
            } catch (error) {
                console.error("Erro ao carregar provas:", error);
            }
    }
        loadExams();
    }, []);
    // pega os dados das turmas
    useEffect(() => {
        async function loadTurmas() {
            try {
                const turmasData = await GetAllSchoolClassesService();
                setTurmas(turmasData); // pega o array de turmas do response
            } catch (err) {
                console.error("Erro ao carregar turmas:", err);
            }
        }
        loadTurmas();
    }, []);

    // busca as notas para uma prova especifica
    /* ===============================
        COORDENADOR → PROVAS DA TURMA
    ================================ */
    useEffect(() => {
        if (type_user !== "coordenadores" || !selectedTurmaId) return;

        async function loadExamsFromTurma() {
        const data = await GetNotasByTurmaService(selectedTurmaId!);

        const map = new Map<string, Exam>();
        // seta os estado de exames antes de pegar os exames de outra turma
        setExams([])
        data.alunos.forEach((aluno: any) => {
            aluno.provas.forEach((prova: any) => {
            if (!map.has(prova.avaliacao_id)) {
                console.log(prova.titulo)
                map.set(prova.avaliacao_id, {
                id: prova.avaliacao_id,
                titulo: prova.titulo ?? "Prova",
                quantidade_questoes: 0,
                turmas: [selectedTurmaId!],
                professor_id: "",
                bimestre: 0,
                area: "",
                dia_a_ser_realizada: "",
                hora_a_ser_liberada: "",
                banco_questao_id: 0,
                questoes_id: [],
                metodo_de_selecao_de_ap: "",
                });
            }
            });
        });

        setExams(Array.from(map.values()));
        }

        loadExamsFromTurma();
    }, [type_user, selectedTurmaId]);
    /* ===============================
        GERAR RELATÓRIO
    ================================ */
    async function loadNotas(avaliacaoId: string, turmaId: number) {
        const data = await GetNotasByTurmaService(turmaId);
        const report: NotaAluno[] = [];

        data.alunos.forEach((aluno: any) => {
        aluno.provas.forEach((prova: any) => {
            if (prova.avaliacao_id === avaliacaoId) {
            report.push({
                nome: aluno.nome,
                matricula: prova.matricula_aluno,
                nota: prova.nota,
            });
            }
        });
        });

        if (report.length === 0) {
        alert("Não há registros de respostas para essa prova.");
        }

        setNotas(report);
    }


    const handleGenerateReport = () => {
        console.log(selectedExamId, selectedTurmaId)
        if (!selectedExamId || selectedTurmaId === null) return;
        loadNotas(selectedExamId, selectedTurmaId);
    };


    /* ===============================
        TURMAS DA PROVA (PROFESSOR)
    ================================ */
    const turmasDaProva = useMemo(() => {
        if (!selectedExamId || type_user !== "professores") return [];

        const exame = exams.find(e => e.id === selectedExamId);
        if (!exame) return [];

        return turmas.filter(t => exame.turmas.includes(t._id));
    }, [selectedExamId, exams, turmas, type_user]);


    return (
        <div className={styles.container}>
            <button
                className={styles.backBtn}
                onClick={() => navigate(`/home?type=${type_user}`)}
            >
                ⬅ Voltar
            </button>
            <h1 className={styles.title}>Relatórios{type_user === "coordenadores" && "(Visão Geral)"}</h1>
            <div>
                <label htmlFor="selectExam" className={styles.textLabel}>Selecione os Filtros</label>
                <label htmlFor=""></label>
                <div className={styles.filters}>
                    {/* ===== COORDENADOR: TURMA PRIMEIRO ===== */}
                    {type_user === "coordenadores" && (
                    <select
                        value={selectedTurmaId ?? ""}
                        onChange={e => {
                        setSelectedTurmaId(Number(e.target.value));
                        setSelectedExamId("");
                        setNotas([]);
                        }}
                    >
                        <option value="">Selecione uma turma</option>
                        {turmas.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.ano} Ano - {t.curso}
                        </option>
                        ))}
                    </select>
                    )}
                    {/* ===== PROFESSOR: PROVA PRIMEIRO ===== */}
                    {type_user === "professores" && (
                    <select
                        value={selectedExamId}
                        onChange={e => {
                        setSelectedExamId(e.target.value);
                        setSelectedTurmaId(null);
                        setNotas([]);
                        }}
                    >
                        <option value="">Selecione uma prova</option>
                        {exams.map(e => (
                        <option key={e.id} value={e.id}>
                            {e.titulo}
                        </option>
                        ))}
                    </select>
                    )}
                    {/* ===== TURMA (PROFESSOR) ===== */}
                    {type_user === "professores" && (
                    <select
                        value={selectedTurmaId ?? ""}
                        disabled={!selectedExamId}
                        onChange={e => setSelectedTurmaId(Number(e.target.value))}
                    >
                        <option value="">Selecione uma turma</option>
                        {turmasDaProva.map(t => (
                        <option key={t._id} value={t._id}>
                            {t.ano} Ano - {t.curso}
                        </option>
                        ))}
                    </select>
                    )}
                    {/* ===== PROVA (COORDENADOR) ===== */}
                    {type_user === "coordenadores" && (
                    <select
                        value={selectedExamId}
                        disabled={!selectedTurmaId}
                        onChange={e => setSelectedExamId(e.target.value)}
                    >
                        <option value="">Selecione uma prova</option>
                        {exams.map(e => (
                        <option key={e.id} value={e.id}>
                            {e.titulo}
                        </option>
                        ))}
                    </select>
                    )}
                    <button 
                        className={styles.searchBtn}
                        onClick={handleGenerateReport}
                    >
                            Gerar Relatório
                    </button>
                </div>
            </div>

            <ExamsReportTable
                notas_alunos={notas}
                id_prova={selectedExamId}
                id_turma={selectedTurmaId ?? undefined}
            />
        </div>
    );
}