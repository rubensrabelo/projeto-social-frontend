import { useState } from "react";
import styles from "./Navbar.module.css";

import logo from "../../assets/logo-eeep.webp"
import notification from "../../assets/notification_icon.svg"
import profile from "../../assets/user-profile.svg"
import menu from "../../assets/profile_options.svg"
import { clearUserSession } from "../../utils/session/clearUserSession";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    clearUserSession();
    navigate("/");
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <img
          src={logo}
          alt="Logo"
          className={styles.logo}
        />
        <span className={styles.systemName}>Sistema de Avaliações</span>
      </div>

      <div className={styles.right}>
        <img
          src={notification}
          alt="Notifications"
          className={styles.icon}
        />

        <img
          src={profile}
          alt="Profile"
          className={styles.profile}
        />

        <img
          src={menu}
          alt="Menu"
          className={styles.arrow}
          onClick={() => setOpenMenu(!openMenu)}
        />

        {openMenu && (
          <div className={styles.dropdownMenu}>
            <button>Meu Perfil</button>
            <button>Configurações</button>
            <button onClick={handleLogout}>Sair</button>
          </div>
        )}
      </div>
    </nav>
  );
}
