import "@styles/users.css";
import "@styles/Finanzas.css";
import "@styles/finanzas-tag.css";
import "@styles/guardar-btn.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import { useLocation } from "react-router-dom";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect, useState } from "react";
import { cambiarRolUsuario } from "@services/userRole.service.js";
import Swal from "sweetalert2";

const rolesPermitidos = ["estudiante", "tesorero", "secretario", "presidente"];

const Users = () => {
  const { users, setUsers, fetchUsers } = useGetUsers();
  const location = useLocation();
  const [busquedaGeneracion, setBusquedaGeneracion] = useState(null);
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const [rolEditando, setRolEditando] = useState({});
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userIdActual = user.id;
  const isAdmin = user.role === "administrador";

  // Eliminado: búsqueda por generación y estado relacionado

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gen = params.get("generacion");
    if (gen) {
      setBusquedaGeneracion(gen);
      import("@services/userByGeneracion.service.js").then(({ getUsersByGeneracion }) => {
        getUsersByGeneracion(gen).then(data => setUsers(data));
      });
    } else {
      setBusquedaGeneracion(null);
      fetchUsers();
    }
    // eslint-disable-next-line
  }, [location.search]);

  const handleRolChange = (userId, nuevoRol) => {
    setRolEditando((prev) => ({ ...prev, [userId]: nuevoRol }));
  };

  const [loadingRol, setLoadingRol] = useState({});
  const handleGuardarRol = async (userId) => {
    const nuevoRol = rolEditando[userId];
    if (!nuevoRol) return;
    if (user.id === userId) {
      Swal.fire({ icon: 'warning', title: 'No puedes cambiar tu propio rol', timer: 1800, showConfirmButton: false });
      return;
    }
    setLoadingRol((prev) => ({ ...prev, [userId]: true }));
    try {
      await cambiarRolUsuario(userId, nuevoRol);
      await fetchUsers();
      setRolEditando((prev) => ({ ...prev, [userId]: undefined }));
      Swal.fire({ icon: 'success', title: 'Rol actualizado correctamente', timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ icon: 'error', title: 'Error al cambiar el rol', text: e?.response?.data?.message || e.message });
    } finally {
      setLoadingRol((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="finanzas-container users-page">
      <h2 className="finanzas-title">{busquedaGeneracion ? `Usuarios de la generación ${busquedaGeneracion}` : 'Lista de Usuarios'}</h2>
      {/* Eliminado: input/botón de búsqueda por generación para CEE */}
      <div className="finanzas-table-wrapper">
        <table className="finanzas-table users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Generación</th>
              <th>Rol</th>
              <th>Acciones</th>
              {isAdmin && <th>Cambiar Rol</th>}
            </tr>
          </thead>
          <tbody>
            {isAdmin && Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.Generacion || user.generacion || 'No especificada'}</td>
                  <td>
                    <span className={`finanzas-tag finanzas-tag-${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <button className="finanzas-btn edit" onClick={() => handleEditUser(user.id, user)}>Editar</button>
                    <button className="finanzas-btn delete" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                  </td>
                  {isAdmin && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <select
                          className="finanzas-input"
                          value={rolEditando[user.id] || user.role}
                          onChange={e => handleRolChange(user.id, e.target.value)}
                          disabled={user.id === userIdActual}
                        >
                          {rolesPermitidos.map((rol) => (
                            <option key={rol} value={rol}>{rol}</option>
                          ))}
                        </select>
                        <button
                          className="finanzas-btn guardar"
                          style={{ marginLeft: 8 }}
                          onClick={() => handleGuardarRol(user.id)}
                          disabled={user.role === (rolEditando[user.id] || user.role) || user.id === userIdActual || loadingRol[user.id]}
                        >
                          {loadingRol[user.id] ? 'Guardando...' : 'Guardar'}
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdmin ? 5 : 4}>No hay usuarios disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
