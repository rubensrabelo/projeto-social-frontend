import styles from "./Landing.module.css";
import CardOption from "../../Components/CardOption/CardOption";

import logo from "../../assets/logo-eeep.webp";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSelect = (role: "aluno" | "professor" | "coordenador") => {
    navigate(`/login?type=${role}`);
  };

  return (
    <div className={styles.landingContainer}>
      <img
        src={logo}
        alt="Logo da EP"
        className={styles.landingImage}
      />

      <div className={styles.cardContainer}>
        <CardOption
          title="Aluno"
          image="/img/aluno.png"
          onClick={() => handleSelect("aluno")}
        />
        <CardOption
          title="Professor"
          image="/img/professor.png"
          onClick={() => handleSelect("professor")}
        />
        <CardOption
          title="Coordenador"
          image="/img/coordenador.png" 
          onClick={() => handleSelect("coordenador")}
        />
      </div>
    </div>
  );
}
