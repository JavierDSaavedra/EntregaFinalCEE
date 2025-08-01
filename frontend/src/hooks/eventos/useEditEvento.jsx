import Swal from "sweetalert2";
import { EditEventos } from "@services/eventos.service.js";

export async function editEventoInfo(evento) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Evento",
    html: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <input id="swal2-input1" class="swal2-input" placeholder="Título" value="${evento.title || ''}">
        <input id="swal2-input2" class="swal2-input" placeholder="Descripción" value="${evento.description || ''}">
        <input id="swal2-input3" class="swal2-input" placeholder="Hora de inicio" type="time" value="${evento.hora_inicio || ''}">
        <input id="swal2-input4" class="swal2-input" placeholder="Hora de fin" type="time" value="${evento.hora_fin || ''}">
        <input id="swal2-input5" class="swal2-input" placeholder="Fecha de inicio" type="date" value="${evento.fecha_inicio ? evento.fecha_inicio.split('T')[0] : ''}">
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const title = document.getElementById("swal2-input1").value;
      const description = document.getElementById("swal2-input2").value;
      const hora_inicio = document.getElementById("swal2-input3").value;
      const hora_fin = document.getElementById("swal2-input4").value;
      const fecha_inicio = document.getElementById("swal2-input5").value;
      if (!title || !hora_inicio || !hora_fin || !fecha_inicio) {
        Swal.showValidationMessage("Completa todos los campos obligatorios");
        return false;
      }
      return { title, description, hora_inicio, hora_fin, fecha_inicio };
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useEditEvento = (fetchEventos) => {
  const handleEditEvento = async (evento) => {
    try {
      const formValues = await editEventoInfo(evento);
      if (!formValues) return;
      const response = await EditEventos(evento.id, formValues);
      if (response && response.message) {
        Swal.fire("Éxito", response.message, "success");
        if (fetchEventos) fetchEventos();
      }
    } catch (error) {
      console.error("Error al editar evento:", error);
      Swal.fire("Error", "No se pudo editar el evento", "error");
    }
  };
  return { handleEditEvento };
};

