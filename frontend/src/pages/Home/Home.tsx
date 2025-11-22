import { useSearchParams, useNavigate } from "react-router-dom";
import CardOption from "../../Components/CardOption/CardOption";

import styles from "./Home.module.css";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const type = searchParams.get("type");

  if (!type || (type !== "professor" && type !== "coordenador")) {
    return <h2>Tipo de usuário inválido.</h2>;
  }

  const isProfessor = type === "professor";

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
              image="/img/questoes.png"
              onClick={() => navigate("/questions")}
            />

            <CardOption
              title="Minhas Provas"
              image="/img/prova.png"
              onClick={() => navigate("/tests")}
            />
          </>
        )}

        {!isProfessor && (
          <CardOption
            title="Gerenciar Turmas"
            image="/img/turma.png"
            onClick={() => navigate("/classes")}
          />
        )}

        <CardOption
          title="Relatórios"
          image="/img/relatorio.png"
          onClick={() => navigate("/reports")}
        />

      </div>
    </div>
  );
}
