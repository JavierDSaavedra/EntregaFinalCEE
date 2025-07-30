import { useState } from "react";
import { GetEventos, CreateEventos, DeleteEvento } from "@services/eventos.service.js";
import { useEditEvento } from "./useEditEvento.jsx";
import Swal from "sweetalert2";

export const useEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { handleEditEvento } = useEditEvento(fetchEventos);

  async function fetchEventos() {
    setLoading(true);
    try {
      const res = await GetEventos();
      // Permite tanto respuesta directa de array como {data: array}
      let eventosArray = Array.isArray(res) ? res : res?.data || [];
      setEventos(eventosArray);
      // Debug rápido para ver qué llega
      console.log('Eventos recibidos:', res, 'Interpretados como:', eventosArray);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateEvento() {
    const { value: formValues } = await Swal.fire({
      title: "Crear Evento",
      html: `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <input id="swal2-input1" class="swal2-input" placeholder="Título">
          <input id="swal2-input2" class="swal2-input" placeholder="Descripción">
          <input id="swal2-input3" class="swal2-input" placeholder="Hora de inicio" type="time">
          <input id="swal2-input4" class="swal2-input" placeholder="Hora de fin" type="time">
          <input id="swal2-input5" class="swal2-input" placeholder="Fecha de inicio" type="date">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const title = document.getElementById("swal2-input1").value;
        const description = document.getElementById("swal2-input2").value;
        const hora_inicio = document.getElementById("swal2-input3").value;
        const hora_fin = document.getElementById("swal2-input4").value;
        const fecha_inicio = document.getElementById("swal2-input5").value;
        if (!title.trim() || !hora_inicio || !hora_fin || !fecha_inicio) {
          Swal.showValidationMessage("Completa todos los campos obligatorios");
          return false;
        }
        if (title.length < 3 || title.length > 100) {
          Swal.showValidationMessage("El título debe tener entre 3 y 100 caracteres");
          return false;
        }
        // Permitir espacios en el título, pero no solo espacios
        if (!/^\S+(?:[\s\S]*\S+)?$/.test(title)) {
          Swal.showValidationMessage("El título no puede ser solo espacios");
          return false;
        }
        return { title, description, hora_inicio, hora_fin, fecha_inicio };
      },
    });
    if (formValues) {
      try {
        const res = await CreateEventos(formValues);
        if (res && res.message) {
          Swal.fire("Éxito", res.message, "success");
          fetchEventos();
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo crear el evento", "error");
      }
    }
  }

  async function handleDeleteEvento(eventoId) {
    const result = await Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    });
    if (result.isConfirmed) {
      try {
        const res = await DeleteEvento(eventoId);
        if (res && res.message) {
          Swal.fire("Eliminado", res.message, "success");
          fetchEventos();
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el evento", "error");
      }
    }
  }

  return {
    eventos,
    loading,
    fetchEventos,
    handleCreateEvento,
    handleEditEvento,
    handleDeleteEvento
  };
};
