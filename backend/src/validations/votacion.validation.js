"use strict";
import Joi from "joi";

export const votacionValidations = Joi.object({
    votacionTitulo: Joi.string()
        .min(3)
        .max(100)
        .required()
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
        "string.pattern.base": "El título solo puede contener letras, números y espacios",
        "string.empty": "El título no puede estar vacío",
        "string.min": "El título debe tener al menos 3 caracteres",
        "string.max": "El título no puede exceder los 100 caracteres",
        }),

    votacionDescripcion: Joi.string()
        .min(10)
        .max(500)
        .required()
        .pattern(/^[a-zA-Z0-9\s.,!?]+$/)
        .messages({
        "string.pattern.base": "La descripción contiene caracteres no permitidos",
        "string.empty": "La descripción no puede estar vacía",
        "string.min": "La descripción debe tener al menos 10 caracteres",
        "string.max": "La descripción no puede exceder los 500 caracteres",
        }),

    votacionFechaInicio: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/) // Formato YYYY-MM-DD HH:MM
        .required()
        .custom((value, helpers) => {
        const fecha = new Date(value);
        if (isNaN(fecha.getTime())) {
        return helpers.error('date.invalid');
        }
        if (fecha <= new Date()) {
        return helpers.error('date.future');
        }
        return value;
        })
        .messages({
        "string.pattern.base": "Formato de fecha inválido. Use YYYY-MM-DD HH:MM",
        "date.invalid": "La fecha de inicio debe ser válida",
        }),

    votacionFechaFin: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/) // Formato YYYY-MM-DD HH:MM
        .required()
        .custom((value, helpers) => {
        const { fechaInicio } = helpers.state.ancestors[0];
        const fechaFin = new Date(value);
        const fechaInicioDate = new Date(fechaInicio);
        
        if (isNaN(fechaFin.getTime())) {
        return helpers.error('date.invalid');
        }
        if (fechaFin <= fechaInicioDate) {
        return helpers.error('date.after');
        }
        return value;
        })
        .messages({
        "string.pattern.base": "Formato de fecha inválido. Use YYYY-MM-DD HH:MM",
        "date.invalid": "La fecha de fin debe ser válida",
        "date.after": "La fecha fin debe ser posterior a la fecha de inicio",
        }),
    votacionEstado: Joi.string()  // Cambia de 'estado' a 'votacionEstado'
        .valid('pendiente', 'activa', 'finalizada', 'cancelada')
        .default('pendiente')
        .messages({
            "string.base": "El estado debe ser un texto",
            "any.only": "El estado debe ser uno de: pendiente, activa, finalizada, cancelada"
        })
});


export const updatedVotacion = Joi.object({
    votacionTitulo: Joi.string()
        .min(3)
        .max(100)
        .required()
        .pattern(/^[a-zA-Z0-9\s]+$/)
        .messages({
        "string.pattern.base": "El título solo puede contener letras, números y espacios",
        "string.empty": "El título no puede estar vacío",
        "string.min": "El título debe tener al menos 3 caracteres",
        "string.max": "El título no puede exceder los 100 caracteres",
        }),

    votacionDescripcion: Joi.string()
        .min(10)
        .max(500)
        .required()
        .pattern(/^[a-zA-Z0-9\s.,!?]+$/)
        .messages({
        "string.pattern.base": "La descripción contiene caracteres no permitidos",
        "string.empty": "La descripción no puede estar vacía",
        "string.min": "La descripción debe tener al menos 10 caracteres",
        "string.max": "La descripción no puede exceder los 500 caracteres",
        }),

    votacionFechaInicio: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/) // Formato YYYY-MM-DD HH:MM
        .required()
        .custom((value, helpers) => {
        const fecha = new Date(value);
        if (isNaN(fecha.getTime())) {
        return helpers.error('date.invalid');
        }
        if (fecha <= new Date()) {
        return helpers.error('date.future');
        }
        return value;
        })
        .messages({
        "string.pattern.base": "Formato de fecha inválido. Use YYYY-MM-DD HH:MM",
        "date.invalid": "La fecha de inicio debe ser válida",
        }),

    votacionFechaFin: Joi.string()
      .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/) // Formato YYYY-MM-DD HH:MM
        .required()
        .custom((value, helpers) => {
        const { fechaInicio } = helpers.state.ancestors[0];
        const fechaFin = new Date(value);
        const fechaInicioDate = new Date(fechaInicio);
        
        if (isNaN(fechaFin.getTime())) {
        return helpers.error('date.invalid');
        }
        if (fechaFin <= fechaInicioDate) {
        return helpers.error('date.after');
        }
        return value;
        })
        .messages({
        "string.pattern.base": "Formato de fecha inválido. Use YYYY-MM-DD HH:MM",
        "date.invalid": "La fecha de fin debe ser válida",
        "date.after": "La fecha fin debe ser posterior a la fecha de inicio",
        }),

    cantidadPreguntas: Joi.number()
    .integer()
    .min(1)
    .required()  
    .messages({
        "number.base": "La cantidad de preguntas debe ser un número",
        "number.integer": "La cantidad debe ser un entero",
        "number.min": "Debe haber al menos 1 pregunta",
    }),

votacionEstado: Joi.string()  // Cambia de 'estado' a 'votacionEstado'
        .valid('pendiente', 'activa', 'finalizada', 'cancelada')
        .default('pendiente')
});