import { DeleteEvento } from "@services/eventos.service.js";
import swal from "sweetalert2";

export const useDeleteEvento = (fetchEventos) => {
  const handleDeleteEvento = async (eventoId) => {
    try {
      // Mostrar confirmación antes de eliminar
      const result = await swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });

      if (result.isConfirmed) {
        console.log('Eliminando evento con ID:', eventoId);
        const response = await DeleteEvento(eventoId);
        console.log('Respuesta del servidor:', response);
        
        if (response) {
          swal.fire({
            title: "Evento eliminado",
            text: "El evento ha sido eliminado correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          await fetchEventos(); 
        }
      }
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al eliminar el evento: " + (error.response?.data?.message || error.message)
      });
    }
  };

  return { handleDeleteEvento };
};

export default useDeleteEvento;