"use strict";

import { EntitySchema } from "typeorm";

export const RespuestaEntity = new EntitySchema({
    name: "Respuesta",
    tableName: "respuestas",
    columns: {
        respuestaId: {
            type: Number,
            primary: true,
            generated: true,
        },
        respuestaContenido: {
            type: String,
            nullable: false,
        },
        preguntaId: {
            type: Number,
            nullable: false,
        },
        usuarioId: {
            type: Number,
            nullable: false,
        },
        votacionId: {
            type: Number,
            nullable: false,
        },
    },
    relations: {
        usuario: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "usuarioId" },
            inverseSide: "respuestas"
        },
        pregunta: {
            type: "many-to-one",
            target: "Pregunta",
            joinColumn: { name: "preguntaId" },
            inverseSide: "respuestas"
        },
        votacion: {
            type: "many-to-one",
            target: "Votacion",
            joinColumn: { name: "votacionId" },
            inverseSide: "respuestas"
        }
    }
});
export default RespuestaEntity;
