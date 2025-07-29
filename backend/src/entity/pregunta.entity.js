"use strict";

import { EntitySchema } from "typeorm";

export const PreguntaEntity = new EntitySchema({
    name: "Pregunta",
    tableName: "preguntas",
    columns: {
        preguntaId: {
            type: Number,
            primary: true,
            generated: true,
        },
        preguntaTitulo: {
            type: String,
            nullable: false,
        },
        preguntaOpciones: {
            type: "json",
            nullable: true,
        },
        votacionId: {
            type: Number,
            nullable: false,
        },
        createdAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        updatedAt: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
    relations: {
        votacion: {
            type: "many-to-one",
            target: "votacion",
            joinColumn: { name: "votacionId" },
            inverseSide: "preguntas"
        },
        respuestas: {
            type: "one-to-many",
            target: "Respuesta",
            inverseSide: "pregunta"
        }
    }
});
export default PreguntaEntity;