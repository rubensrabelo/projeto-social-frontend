import { useEffect, useState } from "react";
import styles from "./AnswerExamPage.module.css";
import { useParams, useNavigate } from "react-router-dom";
import QuestionCard from "././components/QuestionCard"
import type { Question } from "../Questions/types/QuestionType";
import { GetExamByIdService } from "../../api/services/student/GetExamsService";
import { GetQuestionByIdTitleService } from "../../api/services/student/GetQuestionByIdTitleService";
// import { GetQuestionExamService } from "../../api/services/student/GetQuestionsExamService";
import ConfirmDialog from "../Questions/components/ConfirmDialog";
import { getUserSession } from "../../utils/session/getUserSession";
import { CreateGabaritoService } from "../../api/services/gabaritos/CreateGabaritoService";

interface QuestaoResumo{
  id: number;
  enunciado: string;
};

export default function AnswerExamPage() {
  const { examId, professorId} = useParams();
  const student = getUserSession()
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [examTitle, setExamTitle] = useState<string>("")
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Gerenciamento de tempo de prova
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimeOver, setIsTimeOver] = useState(false)
  const EXAM_DURATION = 120 * 60; // 120 minutos em segundos
  const storageKey = `exam_end_${examId}`;

  // Paginação feita no front(isso é eficiente?)
  const [currentPage, setCurrentPage] = useState(0);

  const pageSize = 3; // 1 questão por vez
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentQuestions = questions.slice(startIndex, endIndex); // Pega o intervalo de questões
  const totalPages = Math.max(Math.ceil(questions.length / pageSize), 1);
  const lastPageIndex = totalPages - 1;
  
  // busca questões em lotes para evitar sobrecarga
  async function fetchInBatches(
    questoes: QuestaoResumo[],
    batchSize: number
  ) {
    const results: Question[] = [];

    for (let i = 0; i < questoes.length; i += batchSize) {
      const batch = questoes.slice(i, i + batchSize);
      console.log("📦 LOTE:", batch);

      const batchResults = await Promise.all(
        batch.map(q =>
          GetQuestionByIdTitleService(q.id, q.enunciado)
        )
      );

      results.push(...batchResults);
    }

    return results;
  }

  // Chamar a API para buscar as questões da prova
  useEffect(() => {
    async function fetchQuestions() {
      console.log("🚀 fetchQuestions EXECUTOU");
      console.log("PARAMS:", { examId, professorId });

      if (!professorId || !examId) {
        console.log("XXX faltando coisa");
        return;
      }
        

      const examData = await GetExamByIdService(professorId, examId);
      console.log("📦 examData:", examData);

      setExamTitle(examData.titulo);

      const questoesResumo = examData.questoes || [];
      console.log("🧩 questoesResumo:", questoesResumo);

      if (questoesResumo.length === 0) return;

      const questionsData = await fetchInBatches(questoesResumo, 5);
      console.log("📊 questionsData:", questionsData);

      setQuestions(questionsData);
    }

    fetchQuestions();
  }, [professorId, examId]);


  // Atualiza a pagina atual (garante que não ultrapassa o número de paginas totais)
  useEffect(() => {
    if (currentPage === 0) {setCurrentPage(0);}
    if(currentPage > lastPageIndex){setCurrentPage(lastPageIndex)}
    if(currentPage < 0){setCurrentPage(0)}
  }, [questions, lastPageIndex]);

  // Inicia o temporizador e guarda o tempo em localStorage
  useEffect(() => {
    if (!examId) return;
    // 🧹 Se quiser SEMPRE reiniciar ao entrar
    localStorage.removeItem(storageKey);
    let endTime = localStorage.getItem(storageKey);

    if (!endTime) {
      const newEndTime = Date.now() + EXAM_DURATION * 1000;
      localStorage.setItem(storageKey, newEndTime.toString());
      endTime = newEndTime.toString();
    }

    const remaining = Math.max(
      Math.floor((Number(endTime) - Date.now()) / 1000),
      0
    );

    setTimeLeft(remaining);

    if (remaining === 0) {
      setIsTimeOver(true);
    }
  }, [examId]);

  // Formata o tempo de prova 
  const formatTime = (sec: number) => {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Gerenciamento do tempo de prova
  useEffect(() => {
    if(timeLeft === null) return;
    if (!examId) return;

    if (timeLeft <= 0) {
      setIsTimeOver(true);
      return;
    }

    const interval = setInterval(() => {
      const endTime = Number(localStorage.getItem(storageKey));
      const remaining = Math.max(
        Math.floor((endTime - Date.now()) / 1000),
        0
      );

      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, examId]);

  // Escolha das alternativas
  const handleSelect = (qid: number, letra: string) => {
    if(isTimeOver) return
    setAnswers({ ...answers, [qid]: letra });
  };
  // Envia as respostas do aluno e navega para a revisão
  const finalize = async () => {
    // Calculo de notas
    const { acertadas, erradas } = questions.reduce(
      (acc, q) => {
        const respostaAluno = answers[q.id!];

        if (!respostaAluno) return acc; // ignorar não respondidas
        const mapaAlternativas: Record<string, string | undefined> = {
          a: q.alternativa_a,
          b: q.alternativa_b,
          c: q.alternativa_c,
          d: q.alternativa_d,
          e: q.alternativa_e,
        };

        const respostaTexto = mapaAlternativas[respostaAluno];

        console.log("Resposta aluno (texto):", respostaTexto);
        console.log("Correta:", q.correta);

        if (respostaTexto === q.correta) {
          acc.acertadas.push(q.id!);
        } else {
          acc.erradas.push(q.id!);
        }

        return acc;
      },
      {
        acertadas: [] as number[],
        erradas: [] as number[],
      }
    );
    const totalQuestoes = questions.length;

    const nota = totalQuestoes > 0
    ? (10 / totalQuestoes) * acertadas.length
    : 0;

    // estrutura da requisição
    const payload = {
      matricula_aluno: student.matricula,
      questoes_acertadas: acertadas,
      questoes_erradas: erradas,
      nota: nota,
      avaliacao_id: examId,
    };
    // Envio das respostas
    try {

      await CreateGabaritoService(payload);
      // Remove o registro do temporizador
      localStorage.removeItem(storageKey);
      // Vai para a tela de revisão
      navigate(`/student/examResult/${examId}`, {
        state: { questions, answers, nota }
      });

    } catch (error) {
      console.error("Erro ao finalizar prova:", error);
      alert("Erro ao enviar a prova. Tente novamente.");
    }
  };

  return (
    <div className={styles.container}>

      {/* BLOCO DE QUESTÕES */}
      <div className={styles.questionsArea}>
        <h2 className={styles.examTitle}>{examTitle}  </h2>

        {currentQuestions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              selected={answers[q.id!]}
              disabled={isTimeOver}
              onSelect={(alt) => handleSelect(q.id!, alt)}
            />
          ))}

        <div className={styles.pagination}>
          <button
            className={styles.navigateBtn}
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
          >
            Anterior
          </button>

          <span className={styles.textPagination}>
            Página {currentPage + 1} de {totalPages}
          </span>

          <button
            className={styles.navigateBtn}
            disabled={currentPage === lastPageIndex}
            onClick={() => setCurrentPage(p => Math.min(p + 1, lastPageIndex))}
          >
            Próxima
          </button>
        </div>

      </div>

      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        <div className={styles.progressCard}>
          <h3>Progresso</h3>
          <p className={styles.progressCount}>
            {Object.keys(answers).length}/{questions.length}
          </p>

          <h3>⏱ Tempo restante</h3>
          <p className={`${styles.style} ${timeLeft! <= 60 ? styles.timerWarning : styles.timer}`}>{formatTime(timeLeft!)}</p>

          {currentPage === lastPageIndex && (
            <button
              onClick={finalize}
              className={styles.finishBtn}
            >
              Finalizar prova
            </button>
          )}

          {confirmOpen && (
            <ConfirmDialog
              title="Finalizar prova"
              message="Tem certeza que deseja finalizar a prova? Confira suas respostas antes de confirmar"
              onConfirm={finalize}
              onCancel={() => setConfirmOpen(false)}
            />
          )}
        </div>
      </div>

    </div>
  );
}