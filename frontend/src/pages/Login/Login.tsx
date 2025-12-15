import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

import styles from "./LoginPage.module.css";

import logo from "../../assets/logo-eeep.webp";
import Input from "../../Components/Input/Input";

import { login } from "../../api/services/auth/LoginService";
import { getAluno } from "../../api/services/student/GetAlunoService";
import { saveUserSession } from "../../utils/session/saveUserSession";
import { AuthError } from "../../api/errors/AuthError";

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("");

      if (!form.matricula || (type !== "alunos" && !form.senha)) {
        setError("Preencha todos os campos corretamente.");
        return;
      }

      const matriculaNumber = Number(form.matricula);

      if (Number.isNaN(matriculaNumber)) {
        setError("Matrícula inválida.");
        return;
      }

      setLoading(true);

      if (type === "alunos") {
        const user = await getAluno(matriculaNumber, "alunos");
        saveUserSession(user);
        navigate(`/student`);

        return;
      }

      const data = {
        matricula: matriculaNumber,
        senha: form.senha,
      };

      const user = await login(data, type || "");

      saveUserSession(user);

      navigate(`/home?type=${type}`);
    } catch (err: any) {
      if (err instanceof AuthError) {
        if (err.status === 401 || err.status === 404) {
          setError("Matrícula ou senha inválida.");
          return;
        }

        if (err.status === 400) {
          setError("Dados inválidos. Verifique os campos.");
          return;
        }
      }

      setError("Ocorreu um erro inesperado ao realizar login.");
    }
    finally {
      setLoading(false);
    }
  }

  if (!type) return <h3>Tipo de usuário inválido.</h3>;
  const isFormValid = !!form.matricula && (type === "alunos" || !!form.senha);

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

        {error && <p className={styles.errorMessage}>{error}</p>}

        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={!isFormValid || loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>



        {type !== "alunos" && (
          <div className={styles.linksLogin}>
            <Link to={`/recuper-senha?type=${type}`}>
              Esqueceu sua senha?
            </Link>
          </div>
        )}

        <div className={styles.linksLogin}>
          <Link to={`/`}>
            ⬅ Voltar
          </Link>
        </div>
      </div>
    </div >
  );
}
