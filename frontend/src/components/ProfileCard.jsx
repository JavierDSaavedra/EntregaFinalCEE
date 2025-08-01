import "@styles/profile.css";
import profilePic from "@assets/profilePic.jpg";
import escudo from "@assets/escudo-color-gradiente.png";
import bobEsponja from "@assets/bob-esponja.png";

const ProfileCard = ({ user }) => {
  const isTesorero = user.role && user.role.toLowerCase() === "tesorero";
  return (
    <div className="profile-card">
      <h1 className="profile-header">Perfil de {user.username}</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img src={isTesorero ? bobEsponja : profilePic} alt={`${user.username}'s profile`} />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.username}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
          <p>
            <strong>Generación:</strong> {user.Generacion || user.generacion || 'No especificada'}
          </p>
        </div>
      </div>
      <img src={escudo} alt="Escudo UBB" className="profile-escudo" />
    </div>
  );
};

export default ProfileCard;
