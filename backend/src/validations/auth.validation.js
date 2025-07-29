"use strict";
import Joi from "joi";

const ubiobioEmailValidator =(value, helpers ) => {
    if (!value.endsWith ("@alumnos.ubiobio.cl")){
        return helpers.message(
            "El correo debe finalizar en @alumnos.ubiobio.cl."
        );
    } 
    return value;

}
const passwordComplexity =(value, helpers ) => {
       const regex = /^(?=.*[A-Z])(?=.*\d).{8,26}$/;
    if (!regex.test(value)) {
        return helpers.message(
          "La contraseña debe tener al menos una mayúscula, un número que este entre 8 y 26 caracteres."
        );
    }
    return value;
};

export const registerValidation = Joi.object({
    username: Joi.string()
      .pattern(/^[a-zA-Z0-9_]{3,30}$/)
      .required()
      .messages({
        "string.pattern.base":
          "El nombre de usuario solo puede contener letras, números y guiones bajos (3-30 caracteres).",
        "string.empty": "El nombre de usuario es obligatorio.",
      }),
    rut: Joi.string()
      .pattern(/^\d{2}\.\d{3}\.\d{3}-[\dkK]$/)
      .required()
      .messages({
        "string.pattern.base": "Formato RUT inválido. Debe ser xx.xxx.xxx-x.",
        "string.empty": "El RUT es obligatorio.",
      }),
    email: Joi.string()
      .email()
      .required()
      .custom(ubiobioEmailValidator, "Validación dominio correo")
      .messages({
        "string.email": "El correo electrónico debe ser válido.",
        "string.empty": "El correo electrónico es obligatorio.",
      }),
    password: Joi.string()
      .min(8)
      .max(26)
      .required()
      .custom(passwordComplexity, "Validación de complejidad de contraseña")
      .messages({
        "string.empty": "La contraseña es obligatoria.",
        "string.min": "La contraseña debe tener al menos 8 caracteres.",
        "string.max": "La contraseña debe tener máximo 26 caracteres.",
      }),
    Generacion: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear())
      .required()
      .messages({
        "number.base": "La generación debe ser un número.",
        "number.integer": "La generación debe ser un número entero.",
        "number.min": "La generación debe ser al menos 1900.",
        "number.max": "La generación no puede ser mayor que el año actual.",
        "string.empty": "La generación es obligatoria.",
      }),
      role: Joi.string()
      .min(3)
      .required()
      .messages({
        "string.min": "Debe ingresar un rol válido (mínimo 3 caracteres).",
        "string.empty": "El rol es obligatorio.",
      }),
      })
      .unknown(false)
    .messages({
      "object.unknown": "No se permiten campos adicionales.",
    });

  export const loginValidation = Joi.object({
      email: Joi.string()
        .email()
        .required()
        .messages({
          "string.email": "El correo electrónico debe ser válido.",
          "string.empty": "El correo electrónico es obligatorio.",
        })
        .custom(
          ubiobioEmailValidator,
          "Validación de dominio de correo electrónico"
        ),
      password: Joi.string().min(8).max(26).required().messages({
        "string.empty": "La contraseña no puede estar vacía.",
        "any.required": "La contraseña es obligatoria.",
        "string.min": "La contraseña debe tener al menos 8 caracteres.",
        "string.max": "La contraseña debe tener como máximo 26 caracteres.",
      }),
    })
      .unknown(false)
      .messages({
        "object.unknown": "No se permiten campos adicionales",
      });