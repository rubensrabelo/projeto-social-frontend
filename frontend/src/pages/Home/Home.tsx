import { useSearchParams, useNavigate } from "react-router-dom";
import CardOption from "../../Components/CardOption/CardOption";

import questoes from "../../assets/question_icon.svg";
import provas from "../../assets/tests_icon.svg";
import relatorio from "../../assets/report_icon.svg";
import gerenciar_usuario from "../../assets/usuarios_icon.svg";
import professor from "../../assets/icon-teacher.svg";

import styles from "./Home.module.css";

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
              image={questoes}
              onClick={() => navigate("/banco_de_questoes")}
            />

            <CardOption
              title="Minhas Provas"
              image={provas}
              onClick={() => navigate("/exams")}
            />
          </>
        )}

        {!isProfessor && (
          <>
            <CardOption
              title="Gerenciar Turmas"
              image={gerenciar_usuario}
              onClick={() => navigate("/turmas")}
            />
            <CardOption
              title="Gerenciar professores"
              image={professor}
              onClick={() => navigate("/gerenciar_professores")}
            />
          </>
        )}

        <CardOption
          title="Relatórios"
          image={relatorio}
          onClick={() => navigate("/reports")}
        />

      </div>
    </div>
  );
}
