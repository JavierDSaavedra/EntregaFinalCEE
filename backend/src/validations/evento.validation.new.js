"use strict";
import joi from "joi";

export const createvalidation = joi.object({
   title: joi.string()
   .min(3)
   .max(50)
   .required()
   .messages({
    "string.min": "el titulo debe tener minimo 3 caracteres.",
    "string.max": "el titulo no puede exceder los 50 caracteres.",
    "string.empty": "el titulo es obligatorio.",
    "any.required": "el titulo es obligatorio."
   }),
   
   description: joi.string()
   .min(3)
   .max(100)
   .required()
   .messages({
    "string.min": "la descripcion debe tener minimo 3 caracteres.",
    "string.max": "la descripcion no puede exceder los 100 caracteres.",
    "string.empty": "la descripcion es obligatoria.",
    "any.required": "la descripcion es obligatoria."
   }),

   // Validacion de horas
   hora_inicio: joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
        "string.pattern.base": "La hora de inicio debe tener el formato HH:mm (24 horas).",
        "string.empty": "La hora de inicio es obligatoria.",
        "any.required": "La hora de inicio es obligatoria."
    }),
    
   hora_fin: joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
        "string.pattern.base": "La hora de fin debe tener el formato HH:mm (24 horas).",
        "string.empty": "La hora de fin es obligatoria.",
        "any.required": "La hora de fin es obligatoria."
    }),

   // Validacion de fecha - más flexible
   fecha_inicio: joi.string()
    .required()
    .messages({
        "string.empty": "La fecha de inicio es obligatoria.",
        "any.required": "La fecha de inicio es obligatoria."
    }),
});

export const updatevalidation = joi.object({
    title: joi.string()
   .min(3)
   .max(50)
   .required()
   .messages({
    "string.min": "el titulo debe tener minimo 3 caracteres.",
    "string.max": "el titulo no puede exceder los 50 caracteres.",
    "string.empty": "el titulo es obligatorio.",
    "any.required": "el titulo es obligatorio."
   }),
   
   description: joi.string()
   .min(3)
   .max(100)
   .required()
   .messages({
    "string.min": "la descripcion debe tener minimo 3 caracteres.",
    "string.max": "la descripcion no puede exceder los 100 caracteres.",
    "string.empty": "la descripcion es obligatoria.",
    "any.required": "la descripcion es obligatoria."
   }),

   // Validacion de horas
   hora_inicio: joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
        "string.pattern.base": "La hora de inicio debe tener el formato HH:mm (24 horas).",
        "string.empty": "La hora de inicio es obligatoria.",
        "any.required": "La hora de inicio es obligatoria."
    }),
    
   hora_fin: joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
        "string.pattern.base": "La hora de fin debe tener el formato HH:mm (24 horas).",
        "string.empty": "La hora de fin es obligatoria.",
        "any.required": "La hora de fin es obligatoria."
    })
    .custom((value, helpers) => {
        const { hora_inicio } = helpers.state.ancestors[0];
        if (hora_inicio && value <= hora_inicio) {
            return helpers.message("La hora de fin debe ser mayor que la hora de inicio.");
        }
        return value;
    }),

   // Validacion de fecha
   fecha_inicio: joi.string()
    .required()
    .messages({
        "string.empty": "La fecha de inicio es obligatoria.",
        "any.required": "La fecha de inicio es obligatoria."
    }),
})
.unknown(false)
.messages({
    "object.unknown": "no se permiten campos adicionales",
});
