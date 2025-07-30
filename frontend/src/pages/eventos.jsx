import "@styles/eventos.css";
import useGetEventos from "@hooks/eventos/useGetEventos.jsx";
import useDeleteEvento from '@hooks/eventos/useDeleteEventos.jsx';
import  useEditEventos  from "@hooks/eventos/useEditEventos.jsx";
import useCreateEventos from "@hooks/eventos/useCreateEventos.jsx";
import {  useEffect } from "react";

const Eventos = () => {
  const { eventos, fetchEventos } = useGetEventos();
  const { handleDeleteEvento } = useDeleteEvento(fetchEventos);
  const { handleEditEventos } = useEditEventos(fetchEventos);
  const { handleCreateEventos } = useCreateEventos(fetchEventos);

  useEffect(() => {
    fetchEventos();
  }, [])

  return (
   <div className="eventos_page">
      <div className="eventos-header">
      <h2>lista de eventos </h2>
      <button className="eventos_addbtn" onClick={() => handleCreateEventos()}>añadir Evento</button>
      </div>
      <table className="eventos_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>title</th>
            <th>description</th>
            <th>hora_inicio</th>
            <th>hora_fin</th>
            <th>fecha_inicio</th>
            <th>Acciones</th> 
          </tr>
        </thead>
        <tbody>
          {Array.isArray(eventos) && eventos.length > 0 ? (
            eventos.map((evento) => (
              <tr key={evento.id}>
                <td>{evento.id}</td>
                <td>{evento.title}</td>
                <td>{evento.description}</td>
                <td>{evento.hora_inicio}</td>
                <td>{evento.hora_fin}</td>
                <td>{evento.fecha_inicio}</td>
                <td>
                  <button className="edit" onClick={() => handleEditEventos(evento.id)}>Editar</button>
                  <button className="delete" onClick={() => handleDeleteEvento(evento.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay eventos disponibles</td>
            </tr>
          )}
        </tbody>
        </table>
   </div>
  );
};

export default Eventos;