import Swal from "sweetalert2";
import { FinanzasEdit } from "@services/finanzas.service.js";

async function editFinanzaInfo(finanza) {
  const { value: formValues } = await Swal.fire({
    title: "Editar registro",
    html: `
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre de transacción (obligatorio)" value="${finanza.Nombre_Transaccion}">
        <input id="swal2-input2" class="swal2-input" placeholder="Descripción (opcional)" value="${finanza.Descripcion || ''}">
        <input id="swal2-input3" class="swal2-input" placeholder="Monto (obligatorio)" type="number" min="0" value="${finanza.Monto}">
        <select id="swal2-input4" class="swal2-input">
          <option value="">Tipo de transacción</option>
          <option value="Ingreso" ${finanza.Tipo_Transaccion === "Ingreso" ? "selected" : ""}>Ingreso</option>
          <option value="Egreso" ${finanza.Tipo_Transaccion === "Egreso" ? "selected" : ""}>Egreso</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    preConfirm: () => {
      const Nombre_Transaccion = document.getElementById("swal2-input1").value;
      const Descripcion = document.getElementById("swal2-input2").value;
      const Monto = document.getElementById("swal2-input3").value;
      const Tipo_Transaccion = document.getElementById("swal2-input4").value;
      if (!Nombre_Transaccion || !Monto || !Tipo_Transaccion) {
        Swal.showValidationMessage("Completa los campos obligatorios");
        return false;
      }
      return { Nombre_Transaccion, Descripcion: Descripcion === '' ? '' : Descripcion, Monto: Number(Monto), Tipo_Transaccion };
    },
  });
  if (formValues) {
    return formValues;
  }
}


export const useEditFinanza = (fetchFinanzas) => {
  const handleEditFinanza = async (finanzas) => {
    try {
      // SweetAlert para elegir registro por ID o Nombre_Transaccion
      const { value: tipo } = await Swal.fire({
        title: '¿Buscar registro por ID o Nombre de Transacción?',
        input: 'radio',
        inputOptions: {
          id: 'ID',
          nombre: 'Nombre de Transacción'
        },
        inputValidator: (value) => !value && 'Debes seleccionar una opción',
        confirmButtonText: 'Continuar',
        showCancelButton: true
      });
      if (!tipo) return;
      let registro = null;
      if (tipo === 'id') {
        const { value: id } = await Swal.fire({
          title: 'Ingresa el ID',
          input: 'number',
          inputLabel: 'ID',
          inputValidator: (value) => !value && 'Debes ingresar un ID',
          showCancelButton: true
        });
        if (!id) return;
        registro = finanzas.find(f => String(f.id) === String(id));
      } else {
        const { value: nombre } = await Swal.fire({
          title: 'Ingresa el Nombre de Transacción',
          input: 'text',
          inputLabel: 'Nombre de Transacción',
          inputValidator: (value) => !value && 'Debes ingresar un nombre',
          showCancelButton: true
        });
        if (!nombre) return;
        registro = finanzas.find(f => (f.Nombre_Transaccion || '').toLowerCase().trim() === nombre.toLowerCase().trim());
      }
      if (!registro) {
        Swal.fire('No encontrado', 'No se encontró el registro.', 'warning');
        return;
      }
      let identificador = {};
      if (tipo === 'id') {
        identificador = { id: registro.id };
      } else {
        identificador = { Nombre_Transaccion: registro.Nombre_Transaccion };
      }
      const formValues = await editFinanzaInfo(registro);
      if (!formValues) return;
      const response = await FinanzasEdit(identificador, formValues);
      if (response) {
        await fetchFinanzas();
      }
    } catch (error) {
      console.error("Error al editar registro de finanzas:", error);
    }
  };
  return { handleEditFinanza };
};

export default useEditFinanza;
