"use strict";

import { AppDataSource } from "../config/configDb.js";
import { respuestaValidations } from "../validations/respuesta.validation.js";
import Respuesta from "../entity/respuesta.entity.js";
import Pregunta from "../entity/pregunta.entity.js";
import Votacion from "../entity/votacion.entity.js";
import User from "../entity/user.entity.js";

export async function getRespuestas(req, res) {
    try {
        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const respuestas = await respuestaRepository.find({
            relations: ["usuario", "pregunta", "votacion"]
        });

        res.status(200).json({
            success: true,
            message: "Respuestas obtenidas correctamente",
            data: respuestas
        });
    } catch (error) {
        console.error("Error al obtener respuestas:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener respuestas",
            error: error.message 
        });
    }
}

export async function createRespuesta(req, res) {
    try {
        const { error, value } = respuestaValidations.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                details: error.details.map(d => ({
                    field: d.path[0],
                    message: d.message
                }))
            });
        }

        // Asegurarse de que req.user.id existe
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: "Usuario no autenticado correctamente"
            });
        }

        const usuarioId = req.user.id; // ID del usuario autenticado
        const esAdmin = req.user.role === 'administrador';
        
        // Si se envía usuarioId en el body, validar permisos
        if (value.usuarioId && value.usuarioId !== usuarioId && !esAdmin) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para responder por otro usuario"
            });
        }

        // Verificar relaciones
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const votacionRepository = AppDataSource.getRepository(Votacion);

        const [pregunta, votacion] = await Promise.all([
            preguntaRepository.findOneBy({ preguntaId: value.preguntaId }),
            votacionRepository.findOneBy({ votacionId: value.votacionId })
        ]);

        if (!pregunta || !votacion) {
            return res.status(404).json({
                success: false,
                message: !pregunta ? "Pregunta no encontrada" : "Votación no encontrada"
            });
        }

        if (pregunta.votacionId !== votacion.votacionId) {
            return res.status(400).json({
                success: false,
                message: "La pregunta no pertenece a la votación especificada"
            });
        }

        // Crear la respuesta
        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const nuevaRespuesta = respuestaRepository.create({
            respuestaContenido: value.respuestaContenido,
            preguntaId: value.preguntaId,
            votacionId: value.votacionId,
            usuarioId: value.usuarioId || usuarioId // Usar el del body o el del usuario autenticado
        });

        await respuestaRepository.save(nuevaRespuesta);

        res.status(201).json({
            success: true,
            message: "Respuesta registrada exitosamente",
            data: nuevaRespuesta
        });

    } catch (error) {
        console.error("Error al crear respuesta:", error);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
}
export async function updateRespuesta(req, res) {
    try {
        const { id } = req.params;
        const { error } = respuestaValidations.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                details: error.details
            });
        }

        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const existingRespuesta = await respuestaRepository.findOneBy({ 
            respuestaId: parseInt(id) 
        });

        if (!existingRespuesta) {
            return res.status(404).json({
                success: false,
                message: "Respuesta no encontrada"
            });
        }

        // Verificar permisos (solo admin o dueño puede modificar)
        const esAdmin = req.user.role === 'administrador';
        const esDueño = existingRespuesta.usuarioId === req.user.id;
        
        if (!esAdmin && !esDueño) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para modificar esta respuesta"
            });
        }

        const updatedRespuesta = respuestaRepository.merge(existingRespuesta, req.body);
        await respuestaRepository.save(updatedRespuesta);

        res.status(200).json({
            success: true,
            message: "Respuesta actualizada correctamente",
            data: updatedRespuesta
        });

    } catch (error) {
        console.error("Error al actualizar respuesta:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al actualizar respuesta",
            error: error.message
        });
    }
}

export async function deleteRespuesta(req, res) {
    try {
        const { id } = req.params;

        const respuestaRepository = AppDataSource.getRepository(Respuesta);
        const respuesta = await respuestaRepository.findOneBy({ 
            respuestaId: parseInt(id) 
        });

        if (!respuesta) {
            return res.status(404).json({
                success: false,
                message: "Respuesta no encontrada"
            });
        }

        // Verificar permisos (solo admin o dueño puede eliminar)
        const esAdmin = req.user.role === 'administrador';
        const esDueño = respuesta.usuarioId === req.user.id;
        
        if (!esAdmin && !esDueño) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para eliminar esta respuesta"
            });
        }

        await respuestaRepository.remove(respuesta);

        res.status(200).json({
            success: true,
            message: "Respuesta eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar respuesta:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al eliminar respuesta",
            error: error.message
        });
    }
}