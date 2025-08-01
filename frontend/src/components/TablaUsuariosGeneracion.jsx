const TablaUsuariosGeneracion = ({ usuariosGen }) => (
  <div className="finanzas-table-wrapper">
    <table className="finanzas-table users-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Generación</th>
          <th>Rol</th>
        </tr>
      </thead>
      <tbody>
        {usuariosGen.map(u => (
          <tr key={u.id}>
            <td>{u.username}</td>
            <td>{u.email}</td>
            <td>{u.Generacion || u.generacion || ''}</td>
            <td>{u.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default TablaUsuariosGeneracion;
