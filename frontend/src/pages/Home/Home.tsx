import { useSearchParams, useNavigate } from "react-router-dom";
import CardOption from "../../Components/CardOption/CardOption";

import styles from "./Home.module.css";

import QuestionIcon from "../../assets/QuestionIcon";
import ExamIcon from "../../assets/ExamIcon";
import TeacherIcon from "../../assets/TeacherIcon";
import SchoolClassIcon from "../../assets/SchoolClassIcon";
import HistogramIcon from "../../assets/HistogramIcon";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type");

  if (!type || (type !== "professores" && type !== "coordenadores")) {
    return <h2>Tipo de usuário inválido.</h2>;
  }

  const isProfessor = type === "professores";

  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>
        Bem-vindo {isProfessor ? "Professor" : "Coordenador"}!
      </h1>

      <h2 className={styles.subtitle}>O que você deseja acessar?</h2>

      <div className={styles.cardContainer}>

        {isProfessor && (
          <>
            <CardOption
              title="Minhas Questões"
              Icon={QuestionIcon}
              onClick={() => navigate("/banco_de_questoes")}
            />

            <CardOption
              title="Minhas Provas"
              Icon={ExamIcon}
              onClick={() => navigate("/exams")}
            />
          </>
        )}

        {!isProfessor && (
          <>
            <CardOption
              title="Gerenciar Turmas"
              Icon={SchoolClassIcon}
              onClick={() => navigate("/turmas")}
            />
            <CardOption
              title="Gerenciar professores"
              Icon={TeacherIcon}
              onClick={() => navigate("/gerenciar_professores")}
            />
          </>
        )}

        <CardOption
          title="Relatórios"
          Icon={HistogramIcon}
          onClick={() => navigate(`/reports?type=${type}`)}
        />

      </div>
    </div>
  );
}
