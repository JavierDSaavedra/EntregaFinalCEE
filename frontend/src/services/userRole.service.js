import axios from './root.service.js';

export async function cambiarRolUsuario(userId, nuevoRol) {
  return axios.patch(`/cee/usuarios/${userId}/role`, { role: nuevoRol });
}
