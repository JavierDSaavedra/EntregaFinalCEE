import Swal from "sweetalert2";
import { FinanzasEdit } from "@services/finanzas.service.js";

async function editFinanzaInfo(finanza) {
  const { value: formValues } = await Swal.fire({
    title: "Editar Registro de Finanzas",
    html: `
      <div>
        <label for="swal2-input1">Nombre de Transacción</label>
        <input id="swal2-input1" class="swal2-input" placeholder="Nombre de Transacción" value="${finanza.Nombre_Transaccion}">
      </div>
      <div>
        <label for="swal2-input2">Descripción</label>
        <input id="swal2-input2" class="swal2-input" placeholder="Descripción" value="${finanza.Descripcion}">
      </div>
      <div>
        <label for="swal2-input3">Monto</label>
        <input id="swal2-input3" class="swal2-input" placeholder="Monto" value="${finanza.Monto}">
      </div>
      <div>
        <label for="swal2-input4">Tipo de Transacción</label>
        <select id="swal2-input4" class="swal2-input">
          <option value="Ingreso" ${finanza.Tipo_Transaccion === "Ingreso" ? "selected" : ""}>Ingreso</option>
          <option value="Egreso" ${finanza.Tipo_Transaccion === "Egreso" ? "selected" : ""}>Egreso</option>
        </select>
      </div>
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Editar",
    preConfirm: () => {
      const Nombre_Transaccion = document.getElementById("swal2-input1").value;
      const Descripcion = document.getElementById("swal2-input2").value;
      const Monto = document.getElementById("swal2-input3").value;
      const Tipo_Transaccion = document.getElementById("swal2-input4").value;
      if (!Nombre_Transaccion || !Descripcion || !Monto || !Tipo_Transaccion) {
        Swal.showValidationMessage("Por favor, completa todos los campos");
        return false;
      }
      return { Nombre_Transaccion, Descripcion, Monto: Number(Monto), Tipo_Transaccion };
    },
  });
  if (formValues) {
    return formValues;
  }
}

export const useEditFinanza = (fetchFinanzas) => {
  const handleEditFinanza = async (finanza) => {
    try {
      const formValues = await editFinanzaInfo(finanza);
      if (!formValues) return;
      // Se puede editar por id o por Nombre_Transaccion
      const response = await FinanzasEdit(finanza.id, formValues);
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
