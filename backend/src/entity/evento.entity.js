"user strict";
import { EntitySchema } from "typeorm";
export const eventoEntity = new EntitySchema({
    name: "evento",
   tablename: "evento",
   columns:{
    id:{
        type: Number,
        primary:true,
        generated:true,
    },
    title:{
        type: String,
        nullable:false,
    },
    description:{
        type: String,
        nullable:false,
    },
    hora_inicio:{
        type: String,
        nullable:false,
    },
    hora_fin:{
        type: String,
        nullable:false,
    },
    fecha_inicio:{
        type: String,
        nullable:false,
    },

    createdAt:{
      type:"timestamp",
      default: () => "current_timestamp",

    },
    updatedAt:{
        type: "timestamp",
        default: () => "current_timestamp",
        onUpdate: () => "current_timestamp",
    },
   },
});

export default eventoEntity;