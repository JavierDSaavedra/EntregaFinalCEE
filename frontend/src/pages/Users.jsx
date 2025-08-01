import "@styles/users.css";
import "@styles/Finanzas.css";
import "@styles/finanzas-tag.css";
import "@styles/guardar-btn.css";
import "@styles/swal-cee.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import { useLocation } from "react-router-dom";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import useBuscarUsuariosPorGeneracion from "@hooks/users/useBuscarUsuariosPorGeneracion.jsx";
import useEditarRolUsuario from "@hooks/users/useEditarRolUsuario.jsx";
import TablaUsuariosAdmin from "@components/TablaUsuariosAdmin.jsx";
import TablaUsuariosGeneracion from "@components/TablaUsuariosGeneracion.jsx";
import { useEffect, useState } from "react";


const rolesPermitidos = ["estudiante", "tesorero", "secretario", "presidente"];

const Users = () => {
  const { users, setUsers, fetchUsers } = useGetUsers();
  const location = useLocation();
  const [busquedaGeneracion, setBusquedaGeneracion] = useState(null);
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userIdActual = user.id;
  const {
    rolEditando,
    loadingRol,
    handleRolChange,
    handleGuardarRol,
  } = useEditarRolUsuario(fetchUsers, userIdActual);
  const isAdmin = user.role === "administrador";
  const isCEE = ["presidente", "secretario", "tesorero"].includes(user.role);

useEffect(() => {
  if (!isAdmin) return;
  const params = new URLSearchParams(location.search);
  const gen = params.get("generacion");
  if (gen) {
    setBusquedaGeneracion(gen);
    import("@services/user.service.js").then(({ getUsersByGeneracion }) => {
      getUsersByGeneracion(gen).then(data => setUsers(data));
    });
  } else {
    setBusquedaGeneracion(null);
    fetchUsers();
  }
}, [location.search, isAdmin]);



  if (isAdmin) {
    return (
      <div className="finanzas-container users-page">
        <h2 className="finanzas-title">{busquedaGeneracion ? `Usuarios de la generación ${busquedaGeneracion}` : 'Lista de Usuarios'}</h2>
        <TablaUsuariosAdmin
          users={users}
          userIdActual={userIdActual}
          rolEditando={rolEditando}
          loadingRol={loadingRol}
          handleEditUser={handleEditUser}
          handleDeleteUser={handleDeleteUser}
          handleRolChange={handleRolChange}
          handleGuardarRol={handleGuardarRol}
          rolesPermitidos={rolesPermitidos}
        />
      </div>
    );
  }

  if (isCEE) {
    const {
      generacionInput,
      setGeneracionInput,
      usuariosGen,
      loadingGen,
      errorGen,
      handleBuscarGeneracion,
    } = useBuscarUsuariosPorGeneracion();

    return (
      <div className="finanzas-container users-page">
        <div className="busqueda-generacion-box">
          <h2 className="finanzas-title">Buscar usuarios por generación</h2>
          <form onSubmit={handleBuscarGeneracion} className="busqueda-generacion-form">
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={generacionInput}
              onChange={e => setGeneracionInput(e.target.value)}
              placeholder="Ej: 2022"
              className="busqueda-generacion-input"
              required
            />
            <button className="busqueda-generacion-btn" type="submit" disabled={loadingGen || !generacionInput}>Buscar</button>
          </form>
          {loadingGen && <p className="busqueda-generacion-loading">Buscando...</p>}
          {errorGen && <p className="busqueda-generacion-error">{errorGen}</p>}
        </div>
        {loadingGen && <p>Buscando...</p>}
        {errorGen && <p style={{color:'red'}}>{errorGen}</p>}
        {usuariosGen.length > 0 && <TablaUsuariosGeneracion usuariosGen={usuariosGen} />}
      </div>
    );
  }

  return null;
};

export default Users;
