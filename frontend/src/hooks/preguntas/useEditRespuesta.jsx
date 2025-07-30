import Swal from "sweetalert2";
import { EditRespuesta } from "@services/respuesta.service.js";

async function editRespuestaInfo(respuesta) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Respuesta",
    html: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <input id="swal2-input1" class="swal2-input" placeholder="Contenido de la respuesta" value="${respuesta.respuestaContenido || ''}">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const respuestaContenido = document.getElementById("swal2-input1").value;
      if (!respuestaContenido) {
        Swal.showValidationMessage("El contenido de la respuesta es obligatorio");
        return false;
      }
      return { respuestaContenido };
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useEditRespuesta = (fetchRespuestas) => {
  const handleEditRespuesta = async (respuesta) => {
    try {
      const formValues = await editRespuestaInfo(respuesta);
      if (!formValues) return;
      const response = await EditRespuesta(respuesta.respuestaId, formValues);
      if (response && response.message) {
        Swal.fire("Éxito", response.message, "success");
        if (fetchRespuestas) fetchRespuestas();
      }
    } catch (error) {
      console.error("Error al editar respuesta:", error);
      Swal.fire("Error", "No se pudo editar la respuesta", "error");
    }
  };
  return { handleEditRespuesta };
};
