"use strict";

import { EntitySchema } from "typeorm";

export const Registros_FinanzasEntity = new EntitySchema({
    name: "Finanzas",
    tableName: "Registros",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        Nombre_Transaccion: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        Descripcion: {
            type: "varchar",
            length: 250,
            nullable: true,
        },
        Monto: {
            type: "int",
            nullable: false,
        },
        Tipo_Transaccion: {
            type: "enum",
            enum: ["Ingreso", "Egreso"],
            nullable: false,
        },
        Fecha_Ingresado: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
        },
        Fecha_Actualizado: {
            type: "timestamp",
            default: () => "CURRENT_TIMESTAMP",
            onUpdate: () => "CURRENT_TIMESTAMP",
        },
    },
});

export default Registros_FinanzasEntity;