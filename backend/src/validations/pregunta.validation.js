"use strict";
import Joi from "joi";

export const preguntaValidations = Joi.object({
    preguntaTitulo: Joi.string()
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
        opciones: Joi.array()
        .items(Joi.string().min(1).max(100))    
        .optional()
        .messages({
            "array.base": "Las opciones deben ser un arreglo de strings",
            "string.min": "Cada opción debe tener al menos 1 carácter",
            "string.max": "Cada opción no puede exceder los 100 caracteres",
        }),

        votacionId : Joi.number()
        .required()
        .messages({
            "number.base": "El ID de la votación debe ser un número",
        }), 
})
.unknown(false)
.messages({
    "object.unknown": "no se permiten campos adicionales",
});