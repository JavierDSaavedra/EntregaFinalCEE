import axios from "@services/root.service.js";

export async function GetEventos() {
  try {
    const response = await axios.get("/evento");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los eventos:", error);

  }
}

export async function DeleteEvento(eventoId) {
  try {
    const response = await axios.delete(`/evento/${eventoId}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar evento:", error);
  }
}

export async function EditEventos(eventoId, eventoData) {
  try {
    const response = await axios.put(`/evento/${eventoId}`, eventoData);
    return response.data;
  } catch (error) {
    console.error("Error al editar evento:", error);
  }
  
}

export async function CreateEventos(eventoData) {
  try {
    const response = await axios.post("/evento", eventoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear evento:", error);
  }
}