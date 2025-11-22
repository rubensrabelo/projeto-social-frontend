import { useSearchParams } from "react-router-dom";
import CardOption from "../../Components/CardOption/CardOption";

import styles from "./Home.module.css";

export default function Home() {
  const [searchParams] = useSearchParams();
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
              onClick={() => console.log("Questões")}
            />

            <CardOption
              title="Minhas Provas"
              image="/img/prova.png"
              onClick={() => console.log("Provas")}
            />
          </>
        )}

        {!isProfessor && (
          <CardOption
            title="Gerenciar Turmas"
            image="/img/turma.png"
            onClick={() => console.log("Gerenciar Turmas")}
          />
        )}

        <CardOption
          title="Relatórios"
          image="/img/relatorio.png"
          onClick={() => console.log("Relatórios")}
        />

      </div>
    </div>
  );
}
