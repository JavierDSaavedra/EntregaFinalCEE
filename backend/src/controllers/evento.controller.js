"use strict";
import { eventoEntity } from "../entity/evento.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createvalidation, updatevalidation } from "../validations/evento.validation.js";

export async function getevento(req,res){
    try {
        const eventorepository =AppDataSource.getRepository(eventoEntity);
        const evento = await eventorepository.find();

        res.status(200).json({messaje:" eventos encontrados",data: evento })
      }  catch(error){
        console.error ("error al conseguir evento",error);
        res.status(500).json({messaje: "error al conseguir eventos"});
      }
}

export async function geteventobyid(req,res) {
    try {
       const eventorepository = AppDataSource.getRepository(eventoEntity);
       const {id} = req.params
       const evento = await eventorepository.findOne({where: {id}}); 
       if (!evento) return res.status(404).json({message: "evento no encontrado"});

       res.status(200).json({message: "evento encontrado",data:evento})
    } catch (error) {
       console.error ("error al conseguir evento",error);
        res.status(500).json({messaje: "error al conseguir eventos"});
      } 
    }


export async function createevento(req,res) {
    const eventorepository = AppDataSource.getRepository(eventoEntity);
    const { title, description, hora_inicio, hora_fin, fecha_inicio } = req.body; // <-- Cambia aquí
    const { error } = createvalidation.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });
    const evento = eventorepository.create({
        title,
        description,
        hora_inicio,
        hora_fin,
        fecha_inicio
    });
    try {
        await eventorepository.save(evento);
        res.status(201).json({ message: "evento creado exitosamente", data: evento });
    } catch (error) {
        console.error("error al crear evento", error);
        res.status(500).json({ message: "error al crear evento" });
    }
}

 export async function updateevento(req,res) {
    const eventorepository = AppDataSource.getRepository(eventoEntity);
    const{id}= req.params;
    const{title,description,hour,date}=req.body;
    const evento= await eventorepository.findOne({where: {id}});

     if(!evento) return res.status(400).json({message:"evento no encontrado"});

     const{error} = updatevalidation.validate(req.body);
     if (error) return res.status(400).json({message:error.message})

     evento.title= title || evento.title
    
 }

 export async function deleteevento(req,res) {
    
 }