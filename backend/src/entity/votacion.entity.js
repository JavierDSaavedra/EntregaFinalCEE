import { EntitySchema } from 'typeorm';

export const VotacionEntity = new EntitySchema({
  name: 'Votacion',
  tableName: 'votaciones',
  columns: {
    id: { type: Number, primary: true, generated: true },
    rol: { type: String, nullable: false },
    positivo: { type: Boolean, nullable: false },
  },
});