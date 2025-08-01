import { eventoEntity } from "../entity/evento.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createvalidation, updatevalidation } from "../validations/evento.validation.js";

export async function getevento(req, res) {
  try {
    const eventorepository = AppDataSource.getRepository(eventoEntity);

    const evento = await eventorepository.find();

    res.status(200).json({ message: "Eventos encontrados", data: evento });
  } catch (error) {
    console.error("Error al conseguir evento", error);
    res.status(500).json({ message: "Error al conseguir eventos" });
  }
}

export async function geteventobyid(req, res) {
  try {
    const eventorepository = AppDataSource.getRepository(eventoEntity);

    const { id } = req.params;
    const evento = await eventorepository.findOne({ where: { id } });

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({ message: "Evento encontrado", data: evento });
  } catch (error) {
    console.error("Error al conseguir evento", error);
    res.status(500).json({ message: "Error al conseguir eventos" });
  }
}

export async function createevento(req, res) {
  try {
    const eventorepository = AppDataSource.getRepository(eventoEntity);

    const { title, description, hora_inicio, hora_fin, fecha_inicio } = req.body;
    const { error } = createvalidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const evento = eventorepository.create({
      title,
      description,
      hora_inicio,
      hora_fin,
      fecha_inicio
    });

    await eventorepository.save(evento);

    res.status(201).json({ message: "Evento creado exitosamente", data: evento });
  } catch (error) {
    console.error("Error al crear evento", error);
    res.status(500).json({ message: "Error al crear evento" });
  }
}

export async function updateevento(req, res) {
  try {
    const eventorepository = AppDataSource.getRepository(eventoEntity);

    const { id } = req.params;
    const { title, description, hora_inicio, hora_fin, fecha_inicio } = req.body;
    const evento = await eventorepository.findOne({ where: { id } });

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    const { error } = updatevalidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    evento.title = title || evento.title;
    evento.description = description || evento.description;
    evento.hora_inicio = hora_inicio || evento.hora_inicio;
    evento.hora_fin = hora_fin || evento.hora_fin;
    evento.fecha_inicio = fecha_inicio || evento.fecha_inicio;

    await eventorepository.save(evento);

    res.status(200).json({ message: "Evento actualizado exitosamente", data: evento });
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    res.status(500).json({ message: "Error al actualizar evento" });
  }
}

export async function deleteevento(req, res) {
  try {
    const eventorepository = AppDataSource.getRepository(eventoEntity);

    const { id } = req.params;
    const evento = await eventorepository.findOne({ where: { id } });

    if (!evento) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    await eventorepository.remove(evento);

    res.status(200).json({ message: "Evento eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar evento:", error);
    res.status(500).json({ message: "Error al eliminar evento" });
  }
}