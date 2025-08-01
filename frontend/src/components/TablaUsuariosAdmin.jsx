const TablaUsuariosAdmin = ({ users, userIdActual, rolEditando, loadingRol, handleEditUser, handleDeleteUser, handleRolChange, handleGuardarRol, rolesPermitidos }) => (
  <div className="finanzas-table-wrapper">
    <table className="finanzas-table users-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Generación</th>
          <th>Rol</th>
          <th>Acciones</th>
          <th>Cambiar Rol</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td><span>{user.Generacion || user.generacion || ''}</span></td>
              <td><span className={`finanzas-tag finanzas-tag-${user.role}`}>{user.role}</span></td>
              <td>
                <button className="finanzas-btn edit" onClick={() => handleEditUser(user.id, user)}>Editar</button>
                <button className="finanzas-btn delete" onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
              </td>
              <td>
                <div className="rol-cambiar-wrapper">
                  <select
                    className="finanzas-input"
                    value={rolEditando[user.id] || user.role}
                    onChange={e => handleRolChange(user.id, e.target.value)}
                    disabled={userIdActual === user.id}
                  >
                    {rolesPermitidos.map((rol) => (
                      <option key={rol} value={rol}>{rol}</option>
                    ))}
                  </select>
                  <button
                    className="finanzas-btn guardar"
                    onClick={() => handleGuardarRol(user.id, user)}
                    disabled={user.role === (rolEditando[user.id] || user.role) || userIdActual === user.id || loadingRol[user.id]}
                  >
                    {loadingRol[user.id] ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6}>No hay usuarios disponibles</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default TablaUsuariosAdmin;
