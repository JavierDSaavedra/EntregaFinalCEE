import { useState } from "react";
import Swal from "sweetalert2";
import { cambiarRolUsuario } from "@services/user.service.js";

const swalBaseConfig = {
  background: "#fff",
  customClass: {
    title: "swal2-title-cee",
    confirmButton: "swal2-confirm-cee",
    cancelButton: "swal2-cancel-cee"
  },
  buttonsStyling: false,
};

const useEditarRolUsuario = (fetchUsers, userIdActual) => {
  const [rolEditando, setRolEditando] = useState({});
  const [loadingRol, setLoadingRol] = useState({});

  const handleRolChange = (userId, nuevoRol) => {
    setRolEditando((prev) => ({ ...prev, [userId]: nuevoRol }));
  };

  const handleGuardarRol = async (userId, user) => {
    const nuevoRol = rolEditando[userId];
    if (!nuevoRol) return;
    if (userIdActual === userId) {
      Swal.fire({ ...swalBaseConfig, icon: 'warning', title: 'No puedes cambiar tu propio rol', timer: 1800, showConfirmButton: false });
      return;
    }
    setLoadingRol((prev) => ({ ...prev, [userId]: true }));
    try {
      await cambiarRolUsuario(userId, nuevoRol);
      await fetchUsers();
      setRolEditando((prev) => ({ ...prev, [userId]: undefined }));
      Swal.fire({ ...swalBaseConfig, icon: 'success', title: 'Rol actualizado correctamente', timer: 1500, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ ...swalBaseConfig, icon: 'error', title: 'Error al cambiar el rol', text: e?.response?.data?.message || e.message });
    } finally {
      setLoadingRol((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return {
    rolEditando,
    loadingRol,
    handleRolChange,
    handleGuardarRol,
  };
};

export default useEditarRolUsuario;
