import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

import styles from "./LoginPage.module.css";

import logo from "../../assets/logo-eeep.webp";
import Input from "../../Components/Input/Input";

type LoginForm = {
  matricula: string;
  email: string;
  senha: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [form, setForm] = useState<LoginForm>({
    matricula: "",
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (type === "aluno") {
      console.log("Login aluno:", form.matricula);
      alert("Login de aluno ainda não implementado.");
      return;
    }

    console.log("Login prof/coord:", form.email, form.senha);

    navigate(`/app/home?type=${type}`);
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

        {type !== "aluno" && (
          <div className={styles.forgotPassword}>
            <Link to={`/recover-password?type=${type}`}>
              Esqueceu sua senha?
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
