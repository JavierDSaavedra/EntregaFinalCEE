import { CreateEventos } from "@services/eventos.service.js";
import Swal from "sweetalert2";

async function addeventoPopup() {
    const { value: formValues } = await Swal.fire({
      title: "añadir Evento",
      html: `
        <div>
          <label for="swal2-titulo">Título</label>
        <input id="swal2-titulo" class="swal2-input" placeholder="Título">
        </div>
        <div>
         <label for="swal2-descripcion">Descripción</label>
        <input id="swal2-descripcion" class="swal2-input" placeholder="Descripción">
        </div>
        <div>
          <label for="swal2-hora_inicio">Hora Inicio</label>
          <input id="swal2-hora_inicio" class="swal2-input" placeholder="Hora Inicio">
        </div>
        <div>
          <label for="swal2-hora_fin">Hora Fin</label>
          <input id="swal2-hora_fin" class="swal2-input" placeholder="Hora Fin">
        </div>
        <div>
          <label for="swal2-fecha_inicio">Fecha Inicio</label>
          <input id="swal2-fecha_inicio" class="swal2-input" placeholder="Fecha Inicio">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Añadir Evento",
      preConfirm: () => {
        const title = document.getElementById("swal2-titulo").value;
        const description = document.getElementById("swal2-descripcion").value;
        const hora_inicio = document.getElementById("swal2-hora_inicio").value;
        const hora_fin = document.getElementById("swal2-hora_fin").value;
        const fecha_inicio = document.getElementById("swal2-fecha_inicio").value;

        if (!title || !description || !hora_inicio || !hora_fin || !fecha_inicio) {
          Swal.showValidationMessage("Por favor, completa todos los campos");
          return false;
        }
        return {
          title,
          description,
          hora_inicio,
          hora_fin,
          fecha_inicio
        };
        }
    });
        if (formValues)
          return ({
          title: formValues.title,
          description: formValues.description,
          hora_inicio: formValues.hora_inicio,
          hora_fin: formValues.hora_fin,
          fecha_inicio: formValues.fecha_inicio
        });
    
    return null;
}

 export const useCreateEventos = (fetchEventos) => {
  const handleCreateEventos = async () => {
      try {
        const formValues = await addeventoPopup();
        console.log(formValues);
        if (!formValues) 
          return;
      
        const response = await CreateEventos(formValues);
        if (response) {
          Swal.fire({
            title: "Evento creado exitosamente",
            icon: "success",
            confirmButtonText: "Aceptar",
          });
          await fetchEventos();
        }
      } catch (error) {
        console.log('Error al crear evento:', error);
      }
    }
    return { handleCreateEventos };
  };

  export default useCreateEventos;

