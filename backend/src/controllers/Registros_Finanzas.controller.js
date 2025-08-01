import { AppDataSource } from "../config/configDb.js";
import Registros_FinanzasEntity from "../entity/Registros_Finanzas.entity.js";
import { RegistrosValidation, registroQueryValidation } from "../validations/Registros_Finanzas.validation.js";

export const createRegistro = async (req, res) => {
  const { error, value } = RegistrosValidation.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const repo = AppDataSource.getRepository(Registros_FinanzasEntity);
    const nuevo = repo.create(value);
    const resultado = await repo.save(nuevo);
    return res.status(201).json({ mensaje: "Registro creado exitosamente", data: resultado });
  } catch (err) {
    console.error("Error al crear registro:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updateRegistro = async (req, res) => {
  try {
    const queryValidation = registroQueryValidation.validate(req.query);
    if (queryValidation.error) {
      return res.status(400).json({ mensaje: queryValidation.error.details[0].message });
    }
    const { id, Nombre_Transaccion } = req.query;
    if (!id && !Nombre_Transaccion) {
      return res.status(400).json({ mensaje: "Debe proporcionar el ID o el Nombre de la transacción para actualizar." });
    }
    const { error, value } = RegistrosValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ mensaje: error.details[0].message });
    }
    const repo = AppDataSource.getRepository(Registros_FinanzasEntity);
    let registro;
    if (id) {
      registro = await repo.findOneBy({ id: parseInt(id) });
    } else {
      registro = await repo.findOneBy({ Nombre_Transaccion });
    }
    if (!registro) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }
    repo.merge(registro, { ...value, Fecha_Actualizado: new Date() });
    const actualizado = await repo.save(registro);
    return res.status(200).json({ mensaje: "Registro actualizado correctamente", data: actualizado });
  } catch (err) {
    console.error("Error en updateRegistro:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const deleteRegistro = async (req, res) => {
  try {
    const queryValidation = registroQueryValidation.validate(req.query);
    if (queryValidation.error) {
      return res.status(400).json({ mensaje: queryValidation.error.details[0].message });
    }
    const { id, Nombre_Transaccion } = req.query;
    if (!id && !Nombre_Transaccion) {
      return res.status(400).json({ mensaje: "Debe proporcionar el ID o el Nombre de la transacción para eliminar." });
    }
    const repo = AppDataSource.getRepository(Registros_FinanzasEntity);
    let registro;
    if (id) {
      registro = await repo.findOneBy({ id: parseInt(id) });
    } else {
      registro = await repo.findOneBy({ Nombre_Transaccion });
    }
    if (!registro) {
      return res.status(404).json({ mensaje: "Registro no encontrado." });
    }
    await repo.remove(registro);
    return res.status(200).json({ mensaje: "Registro eliminado exitosamente." });
  } catch (err) {
    console.error("Error en deleteRegistro:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const getInformeRegistros = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(Registros_FinanzasEntity);
    const registros = await repo.find();
    if (registros.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron registros." });
    }
    let totalIngresos = 0;
    let totalEgresos = 0;
    registros.forEach(registro => {
      if (registro.Tipo_Transaccion === "Ingreso") {
        totalIngresos += Number(registro.Monto);
      } else if (registro.Tipo_Transaccion === "Egreso") {
        totalEgresos += Number(registro.Monto);
      }
    });
    const totalNeto = totalIngresos - totalEgresos;
    return res.status(200).json({ mensaje: "Informe de registros obtenido exitosamente", data: registros, totalIngresos, totalEgresos, totalNeto });
  } catch (err) {
    console.error("Error al obtener informe de registros:", err);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

