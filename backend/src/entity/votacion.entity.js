"use strict";

import { EntitySchema } from "typeorm";


export const VotacionEntity = new EntitySchema({
    name: "Votacion",
    tableName: "votacion",
    columns: {
        votacionId: {
            type: Number,
            primary: true,
            generated: true,
        },
        votacionTitulo: {
            type: String,
            nullable: false,
        },
        votacionDescripcion: {
            type: String,
            nullable: true,
        },
        votacionEstado: {
            type: String,
            default: "pendiente",
        },
        votacionFechaInicio: {
            type: "timestamp",
            nullable: false,
        },
        votacionFechaFin: {
            type: "timestamp",
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
        preguntas: {
            type: "one-to-many",
            target: "Pregunta",
            inverseSide: "votacion"
        }
    }
});

export default VotacionEntity;