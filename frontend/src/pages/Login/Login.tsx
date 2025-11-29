import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

import styles from "./LoginPage.module.css";

import logo from "../../assets/logo-eeep.webp";
import Input from "../../Components/Input/Input";

import { login } from "../../api/services/auth/LoginService";
import { saveUserSession } from "../../utils/session/saveUserSession";

type LoginForm = {
  matricula: string;
  senha: string;
};

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [form, setForm] = useState<LoginForm>({
    matricula: "",
    senha: "",
  });

  const [ error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm(function (prev) {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  async function handleSubmit() {
    try {
      if (type === "alunos") {
        const data = { matricula: Number(form.matricula) };

        const user = await login(data, "alunos");

        saveUserSession(user);

        navigate(`/home?type=${type}`);
        return;
      }

      const data = {
        matricula: Number(form.matricula),
        senha: form.senha,
      };

      const user = await login(data, type || "");

      saveUserSession(user);

      navigate(`/home?type=${type}`);
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login.");
    }
  }

  if (!type) return <h3>Tipo de usuário inválido.</h3>;

  return (
    <div className={styles.loginContainer}>
      <img src={logo} alt="Logo" className={styles.logo} />

      <div className={styles.loginCard}>
        <h1 className={styles.title}>
          Login – {type.charAt(0).toUpperCase() + type.slice(1)}
        </h1>

        {type === "alunos" ? (
          <Input
            label="Matrícula"
            name="matricula"
            value={form.matricula}
            onChange={handleChange}
          />
        ) : (
          <>
            <Input
              label="Matrícula"
              name="matricula"
              value={form.matricula}
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

        { error && <p className={styles.errorMessage}>{error}</p>}

        <button className={styles.submitButton} onClick={handleSubmit}>
          Entrar
        </button>

        {type !== "alunos" && (
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
