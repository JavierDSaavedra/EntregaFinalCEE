
import axios from "@services/root.service.js";


export async function GetEventos() {
  try {
    const response = await axios.get("/eventos");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los eventos:", error);
    // Devuelve array vacío para evitar undefined en frontend
    return { data: [] };
  }
}


export async function DeleteEvento(eventoId) {
  try {
    const response = await axios.delete(`/eventos/${eventoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar evento:", error);
  }
}




export async function EditEventos(eventoId, eventoData) {
  try {
    const response = await axios.put(`/eventos/${eventoId}`, eventoData);
    return response.data;
  } catch (error) {
    console.error("Error al editar evento:", error);
  }
}


export async function CreateEventos(eventoData) {
  try {
    const response = await axios.post("/eventos", eventoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear evento:", error);
  }
}