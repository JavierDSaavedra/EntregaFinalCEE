import { editUser } from "../../services/user.service";
import Swal from "sweetalert2";

async function editUserInfo(user) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Usuario",
    html: `
    <div>
      <label for="swal2-input1">Nombre de usuario</label>  
      <input id="swal2-input1" class="swal2-input" placeholder="Nombre de usuario" value = "${user.username}">
    </div>
    <div>
      <label for="swal2-input2">Correo electrónico</label>
      <input id="swal2-input2" class="swal2-input" placeholder="Correo electrónico" value = "${user.email}">
    </div>
    <div>
      <label for="swal2-input3">Generación</label>
      <input id="swal2-input3" class="swal2-input" type="number" min="1900" max="${new Date().getFullYear()}" placeholder="Generación" value = "${user.Generacion || user.generacion || ''}">
    </div>
        `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const username = document.getElementById("swal2-input1").value;
      const email = document.getElementById("swal2-input2").value;
      const generacion = document.getElementById("swal2-input3").value;

      if (!username || !email || !generacion) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }

      if (username.length < 3 || username.length > 30) {
        Swal.showValidationMessage(
          "El nombre de usuario debe tener entre 3 y 30 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        Swal.showValidationMessage(
          "El nombre de usuario solo puede contener letras, números y guiones bajos"
        );
        return false;
      }

      if (!email || email.length < 15 || email.length > 50) {
        Swal.showValidationMessage(
          "El correo electrónico debe tener entre 15 y 50 caracteres"
        );
        return false;
      }

      if (!/^[a-zA-Z0-9._%+-]+@alumnos\.ubiobio\.cl$/.test(email)) {
        Swal.showValidationMessage(
          "Por favor, ingresa un correo válido de alumnos.ubiobio.cl (@alumnos.ubiobio.cl)"
        );
        return false;
      }

      if (isNaN(generacion) || generacion < 1900 || generacion > new Date().getFullYear()) {
        Swal.showValidationMessage(
          `La generación debe ser un año entre 1900 y ${new Date().getFullYear()}`
        );
        return false;
      }

      return { username, email, Generacion: generacion };
    },
  });
  if (formValues) {
    return {
      username: formValues.username,
      email: formValues.email,
      Generacion: formValues.Generacion,
    };
  }
}

export const useEditUser = (fetchUsers) => {
  const handleEditUser = async (userId, user) => {
    try {
      const formValues = await editUserInfo(user);
      if (!formValues) return;

      const response = await editUser(userId, formValues);
      if (response) {
        await fetchUsers();
        Swal.fire({
          icon: 'success',
          title: 'Usuario actualizado correctamente',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error("Error al editar usuario:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error al editar usuario',
        text: error?.response?.data?.message || error.message
      });
    }
  };

  return { handleEditUser };
};

export default useEditUser;
