"use strict";
import Joi from "joi";

export const RegistrosValidation = Joi.object({
  Nombre_Transaccion: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .messages({
      "string.pattern.base":
        "El nombre del registro solo puede contener letras, números y espacios.",
      "string.min": "El nombre del registro debe tener al menos 3 caracteres.",
      "string.max": "El nombre del registro no puede exceder los 100 caracteres.",
      "string.empty": "El nombre del registro no puede estar vacío.",
      "any.required": "El nombre del registro es obligatorio.",
    }),

  Descripcion: Joi.string()
    .max(250)
    .allow("")
    .pattern(/^[\w\s.,;:()¡!¿?'"%-]+$/)
    .optional()
    .messages({
      "string.pattern.base": "La descripción contiene caracteres no permitidos.",
      "string.max": "No puede exceder los 250 caracteres.",
    }),

  Monto: Joi.number()
    .positive()
    .integer()
    .required()
    .messages({
      "number.base": "El monto debe ser un número.",
      "number.positive": "El monto debe ser mayor a 0.",
      "number.integer": "El monto debe ser un número entero.",
      "any.required": "El monto es obligatorio.",
    }),

  Tipo_Transaccion: Joi.string()
    .valid("Ingreso", "Egreso")
    .required()
    .messages({
      "any.only": "El tipo de transacción debe ser 'Ingreso' o 'Egreso'.",
      "string.empty": "El tipo de transacción no puede estar vacío.",
      "any.required": "El tipo de transacción es obligatorio.",
    }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten campos adicionales",
  });

export const registroQueryValidation = Joi.object({
  id: Joi.number()
  .integer()
  .positive()
  .optional(),
  Nombre_Transaccion: Joi.string()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s]+$/)
    .optional(),
})
  .or("id", "Nombre_Transaccion")
  .messages({
    "object.missing": "Debe proporcionar el ID o el Nombre de la transacción.",
    "string.pattern.base": "El nombre solo puede contener letras, números y espacios.",
  });
