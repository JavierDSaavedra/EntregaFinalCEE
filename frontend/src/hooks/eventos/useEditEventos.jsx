import { EditEventos, GetEventos }  from "@services/eventos.service";
import swal from "sweetalert2";

async function useEditEventoAlert(eventoId) {
    try {
        // Get all eventos and find the one with the matching ID
        const eventosData = await GetEventos();
        const evento = eventosData.data.find(e => e.id === eventoId);
        
        if (!evento) {
            swal.fire({
                icon: "error",
                title: "Error",
                text: "Evento no encontrado"
            });
            return null;
        }

        const newTitle = prompt("Nuevo título:", evento.title);
        if (newTitle === null) return null; // User cancelled
        
        const newDescription = prompt("Nueva descripción:", evento.description);
        if (newDescription === null) return null; // User cancelled
        
        const newHoraInicio = prompt("Nueva hora de inicio:", evento.hora_inicio);
        if (newHoraInicio === null) return null; // User cancelled
        
        const newHoraFin = prompt("Nueva hora de fin:", evento.hora_fin);
        if (newHoraFin === null) return null; // User cancelled
        
        const newFechaInicio = prompt("Nueva fecha de inicio:", evento.fecha_inicio);
        if (newFechaInicio === null) return null; // User cancelled

        const updatedEvento = {
            title: newTitle,
            description: newDescription,
            hora_inicio: newHoraInicio,
            hora_fin: newHoraFin,
            fecha_inicio: newFechaInicio,
        };

        return updatedEvento;
    } catch (error) {
        console.error("Error al obtener evento:", error);
        swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al obtener los datos del evento"
        });
        return null;
    }
}

export const useEditEventos = (fetchEventos) => {
    const handleEditEventos = async (eventoId) => {
        try {
            const updatedEventoData = await useEditEventoAlert(eventoId);
            if (!updatedEventoData) {
                return;
            }
            
            const response = await EditEventos(eventoId, updatedEventoData);
            if (response) {
                swal.fire({
                    icon: "success",
                    title: "Éxito",
                    text: "Evento actualizado correctamente"
                });
                await fetchEventos();
            }
        } catch (error) {
            console.error("Error al editar evento:", error);
            swal.fire({
                icon: "error",
                title: "Error",
                text: "Error al actualizar el evento"
            });
        }
    };

    return { handleEditEventos };
};

export default useEditEventos;
