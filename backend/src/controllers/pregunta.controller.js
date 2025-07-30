import { AppDataSource } from "../config/configDb.js";
import { preguntaValidations } from "../validations/pregunta.validation.js";
import Pregunta from "../entity/pregunta.entity.js";
import Votacion from "../entity/votacion.entity.js";

export async function getPreguntas(req, res) {
    try {
        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        let preguntas;
        if (req.query.votacionId) {
            preguntas = await preguntaRepository.find({
                where: { votacionId: Number(req.query.votacionId) },
                relations: ["votacion", "respuestas"]
            });
        } else {
            preguntas = await preguntaRepository.find({
                relations: ["votacion", "respuestas"]
            });
        }
        res.status(200).json({
            success: true,
            message: "Preguntas obtenidas correctamente",
            data: preguntas
        });
    } catch (error) {
        console.error("Error al obtener preguntas:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener preguntas",
            error: error.message 
        });
    }
}

export async function createPregunta(req, res) {
    try {
        const { error } = preguntaValidations.validate(req.body);
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

        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const votacionRepository = AppDataSource.getRepository(Votacion);
        
        const votacion = await votacionRepository.findOneBy({ 
            votacionId: req.body.votacionId 
        });
        
        if (!votacion) {
            return res.status(404).json({
                success: false,
                message: "La votación especificada no existe"
            });
        }

        const newPregunta = preguntaRepository.create({
            preguntaTitulo: req.body.preguntaTitulo,
            opciones: req.body.opciones || [],
            votacionId: req.body.votacionId
        });

        await preguntaRepository.save(newPregunta);

        res.status(201).json({
            success: true,
            message: "Pregunta creada correctamente",
            data: newPregunta
        });

    } catch (error) {
        console.error("Error al crear pregunta:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al crear pregunta",
            error: error.message
        });
    }
}

export async function updatePregunta(req, res) {
    try {
        const { id } = req.params;
        const { error } = preguntaUpdateValidations.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                details: error.details
            });
        }

        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const pregunta = await preguntaRepository.findOneBy({ 
            preguntaId: parseInt(id) 
        });

        if (!pregunta) {
            return res.status(404).json({
                success: false,
                message: "Pregunta no encontrada"
            });
        }

        if (req.body.votacionId) {
            const votacionRepository = AppDataSource.getRepository(Votacion);
            const votacion = await votacionRepository.findOneBy({ 
                votacionId: req.body.votacionId 
            });
            
            if (!votacion) {
                return res.status(404).json({
                    success: false,
                    message: "La votación especificada no existe"
                });
            }
        }
        const updatedPregunta = preguntaRepository.merge(pregunta, req.body);
        await preguntaRepository.save(updatedPregunta);

        res.status(200).json({
            success: true,
            message: "Pregunta actualizada correctamente",
            data: updatedPregunta
        });

    } catch (error) {
        console.error("Error al actualizar pregunta:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al actualizar pregunta",
            error: error.message
        });
    }
}

export async function deletePregunta(req, res) {
    try {
        const { id } = req.params;

        const preguntaRepository = AppDataSource.getRepository(Pregunta);
        const pregunta = await preguntaRepository.findOne({ 
            where: { preguntaId: parseInt(id) },
            relations: ["respuestas"]
        });

        if (!pregunta) {
            return res.status(404).json({
                success: false,
                message: "Pregunta no encontrada"
            });
        }

        if (pregunta.respuestas && pregunta.respuestas.length > 0) {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar una pregunta con respuestas asociadas"
            });
        }

        await preguntaRepository.remove(pregunta);

        res.status(200).json({
            success: true,
            message: "Pregunta eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar pregunta:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al eliminar pregunta",
            error: error.message
        });
    }
}