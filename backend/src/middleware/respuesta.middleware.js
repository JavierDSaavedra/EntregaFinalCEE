"use strict";
import { AppDataSource } from "../config/configDb.js";
import { RespuestaEntity } from "../entity/respuesta.entity.js";
import { UserEntity } from "../entity/user.entity.js";
import { PreguntaEntity } from "../entity/pregunta.entity.js";
import { VotacionEntity } from "../entity/votacion.entity.js";

export async function validateRespuesta(req, res, next) {
    try {
        const { preguntaId, usuarioId: bodyUsuarioId, votacionId } = req.body;
        const requestingUserId = req.user.id;
        const userRole = req.user.role;

        const respuestaRepository = AppDataSource.getRepository(RespuestaEntity);
        const preguntaRepository = AppDataSource.getRepository(PreguntaEntity);
        const usuarioRepository = AppDataSource.getRepository(UserEntity);
        const votacionRepository = AppDataSource.getRepository(VotacionEntity);

        // Validar usuario
        let usuarioIdAValidar = requestingUserId;
        if (userRole === 'administrador' && bodyUsuarioId) {
            usuarioIdAValidar = bodyUsuarioId;
            const usuarioExiste = await usuarioRepository.findOneBy({ id: usuarioIdAValidar });
            if (!usuarioExiste) {
                return res.status(404).json({ 
                    message: "El usuario especificado no existe",
                    code: "USUARIO_NO_ENCONTRADO"
                });
            }
        } else if (bodyUsuarioId && bodyUsuarioId !== requestingUserId) {
            return res.status(403).json({ 
                message: "No tienes permiso para responder por otro usuario",
                code: "PERMISO_DENEGADO"
            });
        }

        // Validar que existe la pregunta (CORRECCIÓN PRINCIPAL: usando preguntaId)
        const preguntaExiste = await preguntaRepository.findOneBy({ 
            preguntaId: preguntaId  // ← Aquí está la corrección clave
        });
        
        if (!preguntaExiste) {
            return res.status(404).json({ 
                message: "La pregunta no existe",
                code: "PREGUNTA_NO_ENCONTRADA"
            });
        }

        // Validar que existe la votación
        const votacionExiste = await votacionRepository.findOneBy({ 
            votacionId: votacionId 
        });
        if (!votacionExiste) {
            return res.status(404).json({ 
                message: "La votación no existe",
                code: "VOTACION_NO_ENCONTRADA"
            });
        }

        // Validar que la pregunta pertenece a la votación
        if (preguntaExiste.votacionId !== votacionId) {
            return res.status(400).json({ 
                message: "La pregunta no pertenece a la votación especificada",
                code: "RELACION_INVALIDA"
            });
        }

        // Validar respuesta duplicada
        const respuestaExistente = await respuestaRepository.findOne({
            where: {
                usuarioId: usuarioIdAValidar,
                preguntaId: preguntaId
            }
        });

        if (respuestaExistente) {
            return res.status(409).json({ 
                message: "El usuario ya ha respondido a esta pregunta",
                code: "RESPUESTA_DUPLICADA"
            });
        }

        next();
    } catch (error) {
        console.error("Error en validateRespuesta:", error);
        res.status(500).json({ 
            message: "Error interno del servidor durante la validación", 
            code: "ERROR_VALIDACION",
            error: error.message 
        });
    }
}