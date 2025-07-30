import Joi from "joi";

export const respuestaValidations = Joi.object({
    respuestaContenido: Joi.string().required(),
    preguntaId: Joi.number().required(),
    votacionId: Joi.number().required(),  
    usuarioId: Joi.number().optional()
}).unknown(false);