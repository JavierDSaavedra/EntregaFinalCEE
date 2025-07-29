import { EntitySchema } from 'typeorm';

export const GeneracionEntity = new EntitySchema({
  name: 'Generacion',
  tableName: 'generaciones',
  columns: {
    id: { type: Number, primary: true, generated: true },
    anio: { type: Number, unique: true },
  },
});