import Sidebar from "../components/Sidebar";
import "../styles/ceeHome.css";
import insignia from "../assets/escudo-color-gradiente.png";

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  return (
    <div className="cee-home-layout">
      <Sidebar />
      <main className="cee-home-main">
        <div className="cee-home-bg">
          <div className="cee-home-container">
            <img src={insignia} alt="Insignia CEE" className="cee-home-logo" />
            <div className="cee-home-title">Bienvenido al Sistema CEE</div>
            <div className="cee-home-welcome">
              {user?.nombre ? `Hola, ${user.nombre}!` : "¡Accede a las funciones desde el menú lateral!"}
            </div>
            <div className="cee-home-footer">
              Comité Ejecutivo Estudiantil &copy; {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
