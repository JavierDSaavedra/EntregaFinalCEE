

import { editEventoInfo } from "./useEditEvento.jsx";

const useEditEventos = (fetchEventos) => {
  const handleEditEventos = async (eventoId) => {
    try {
      const eventosData = await GetEventos();
      const evento = eventosData.data.find(e => e.id === eventoId);
      if (!evento) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Evento no encontrado"
        });
        return;
      }
      const formValues = await editEventoInfo(evento);
      if (!formValues) return;
      const response = await EditEventos(eventoId, formValues);
      if (response && response.message) {
        Swal.fire("Éxito", response.message, "success");
        if (fetchEventos) fetchEventos();
      }
    } catch (error) {
      console.error("Error al editar evento:", error);
      Swal.fire("Error", "No se pudo editar el evento", "error");
    }
  };
  return { handleEditEventos };
};

export default useEditEventos;
