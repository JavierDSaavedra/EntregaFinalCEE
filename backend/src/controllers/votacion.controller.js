import { AppDataSource } from "../config/configDb.js";
import { votacionValidations } from "../validations/votacion.validation.js";
import Votacion from "../entity/votacion.entity.js";

export async function getVotaciones(req, res) {
    try {
        const votacionRepository = AppDataSource.getRepository(Votacion);
        let votaciones = await votacionRepository.find({
            relations: ["preguntas"]
        });

        // Actualizar estado a 'finalizada' si corresponde
        const now = new Date();
        const toUpdate = votaciones.filter(v => v.votacionEstado !== 'finalizada' && new Date(v.votacionFechaFin) < now);
        if (toUpdate.length > 0) {
            for (const v of toUpdate) {
                v.votacionEstado = 'finalizada';
                await votacionRepository.save(v);
            }
            // Volver a consultar para devolver datos actualizados
            votaciones = await votacionRepository.find({ relations: ["preguntas"] });
        }

        res.status(200).json({
            success: true,
            message: "Votaciones obtenidas correctamente",
            data: votaciones
        });
    } catch (error) {
        console.error("Error al obtener votaciones:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener votaciones",
            error: error.message 
        });
    }
}

export async function createVotacion(req, res) {
    try {
        const { error } = votacionValidations.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                details: error.details
            });
        }

        const votacionRepository = AppDataSource.getRepository(Votacion);
        const newVotacion = votacionRepository.create({
            votacionTitulo: req.body.votacionTitulo,
            votacionDescripcion: req.body.votacionDescripcion,
            votacionFechaInicio: new Date(req.body.votacionFechaInicio),
            votacionFechaFin: new Date(req.body.votacionFechaFin),
            votacionEstado: req.body.votacionEstado
        });

        await votacionRepository.save(newVotacion);

        res.status(201).json({
            success: true,
            message: "Votación creada correctamente",
            data: newVotacion
        });

    } catch (error) {
        console.error("Error al crear votación:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al crear votación",
            error: error.message
        });
    }
}

export async function updateVotacion(req, res) {
    try {
        const { id } = req.params;
        const { error } = votacionValidations.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Error de validación",
                details: error.details
            });
        }

        const votacionRepository = AppDataSource.getRepository(Votacion);
        const votacion = await votacionRepository.findOneBy({ 
            votacionId: parseInt(id) 
        });

        if (!votacion) {
            return res.status(404).json({
                success: false,
                message: "Votación no encontrada"
            });
        }

        const updatedVotacion = votacionRepository.merge(votacion, {
            votacionTitulo: req.body.votacionTitulo,
            votacionDescripcion: req.body.votacionDescripcion,
            votacionFechaInicio: new Date(req.body.votacionFechaInicio),
            votacionFechaFin: new Date(req.body.votacionFechaFin),
            votacionEstado: req.body.votacionEstado
        });

        await votacionRepository.save(updatedVotacion);

        res.status(200).json({
            success: true,
            message: "Votación actualizada correctamente",
            data: updatedVotacion
        });

    } catch (error) {
        console.error("Error al actualizar votación:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al actualizar votación",
            error: error.message
        });
    }
}

export async function deleteVotacion(req, res) {
    try {
        const { id } = req.params;

        const votacionRepository = AppDataSource.getRepository(Votacion);
        const votacion = await votacionRepository.findOne({ 
            where: { votacionId: parseInt(id) },
            relations: ["preguntas"]
        });

        if (!votacion) {
            return res.status(404).json({
                success: false,
                message: "Votación no encontrada"
            });
        }

        if (votacion.preguntas && votacion.preguntas.length > 0) {
            return res.status(400).json({
                success: false,
                message: "No se puede eliminar una votación con preguntas asociadas"
            });
        }

        await votacionRepository.remove(votacion);

        res.status(200).json({
            success: true,
            message: "Votación eliminada correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar votación:", error);
        res.status(500).json({
            success: false,
            message: "Error interno al eliminar votación",
            error: error.message
        });
    }
}

