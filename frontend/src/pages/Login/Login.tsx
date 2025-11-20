import { useSearchParams } from "react-router-dom";
import { useState } from "react";

import styles from "./LoginPage.module.css";

import logo from "../../assets/logo-eeep.webp";
import Input from "../../Components/Input/Input";

export default function Login() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [form, setForm] = useState({
    matricula: "",
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (type === "aluno") {
      console.log("Login aluno:", form.matricula);
    } else {
      console.log("Login prof/coord:", form.email, form.senha);
    }
  };

  if (!type) return <h3>Tipo de usuário inválido.</h3>;

  return (
    <div className={styles.loginContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />

      <div className={styles.loginCard}>
        <h1 className={styles.title}>
          Login – {type.charAt(0).toUpperCase() + type.slice(1)}
        </h1>

        {type === "aluno" ? (
          <Input
            label="Matrícula"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
          />
        ) : (
          <>
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <Input
              label="Senha"
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
            />
          </>
        )}

        <button className={styles.submitButton} onClick={handleSubmit}>
          Entrar
        </button>
      </div>
    </div>
  );
}
