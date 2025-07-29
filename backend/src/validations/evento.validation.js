"use strict";
import joi from "joi";

export const createvalidation = joi.object({
   title:joi.string()
   .min(3)
   .max(50)
   .required()
   .pattern(/^[a-zA-Z0-9_]+$/)
   .message({
    "string.patter.base":"el titulo solo puede contener letras y numeros.",
    "string.min": "el titulo debe tener minimo 3 caracteres.",
    "string.max" : "el titulo no puede exceder los 50 caracteres.",
    "string.empaty": "el titulo es obligatorio.",
   }),
   description:joi.string()
   .min(3)
   .max(100)
   .required()
   .pattern(/^[a-zA-Z0-9_\s]+$/)
   .message({
    "string.patter.base":"la descripcion solo puede contener letras y numero.",
    "string.min":"la descripcion debe tner minimo 3 caracteres.",
    "string.max":"la descripcion no puede exceder los 100 caracteres.",
    "string.empaty":"la descripcion es obligatoria.",
   }),
//validacion de horas
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
//validacion de fecha sera solo numeros del 0 al 2400
fecha_inicio: joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "La fecha de inicio debe ser una fecha válida.",
            "date.format": "La fecha de inicio debe tener el formato ISO (YYYY-MM-DD).",
            "any.required": "La fecha de inicio es obligatoria.",
            "date.empty": "La fecha de inicio es obligatoria."
        }),
})
export const updatevalidation= joi.object({
    title:joi.string()
   .min(3)
   .max(50)
   .required()
   .pattern(/^[a-zA-Z0-9_]+$/)
   .message({
    "string.patter.base":"el titulo solo puede contener letras y numeros.",
    "string.min": "el titulo debe tener minimo 3 caracteres.",
    "string.max" : "el titulo no puede exceder los 50 caracteres.",
    "string.empaty": "el titulo es obligatorio.",
   }),
   description:joi.string()
   .min(3)
   .max(100)
   .required()
   .pattern(/^[a-zA-Z0-9_\s]+$/)
   .message({
    "string.patter.base":"la descripcion solo puede contener letras y numero.",
    "string.min":"la descripcion debe tner minimo 3 caracteres.",
    "string.max":"la descripcion no puede exceder los 100 caracteres.",
    "string.empaty":"la descripcion es obligatoria.",
   }),
//validacion de horas
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
    //valdacion de fecha
    fecha_inicio: joi.date()
        .iso()
        .required()
        .messages({
            "date.base": "La fecha de inicio debe ser una fecha válida.",
            "date.format": "La fecha de inicio debe tener el formato ISO (YYYY-MM-DD).",
            "any.required": "La fecha de inicio es obligatoria.",
            "date.empty": "La fecha de inicio es obligatoria."
        }),


})
.unknown(false)
.messages({
    "object.unknown": "no se permiten campos adicionales",
});