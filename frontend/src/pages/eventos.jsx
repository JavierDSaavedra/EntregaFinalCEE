import "@styles/eventos.css";


import { useEventos } from "@hooks/eventos/useEventos.jsx";
import { useEffect, useState } from "react";
import { useAuth } from "@context/AuthContext";


const Eventos = () => {
  const { eventos, fetchEventos, handleCreateEvento, handleEditEvento, handleDeleteEvento } = useEventos();
  const { user } = useAuth();
  const rol = user?.rol || user?.role;
  const isCEE = ["presidente", "secretario", "tesorero"].includes(rol);
  // Solo CEE puede gestionar, los demás solo ven
  // Si el usuario no es CEE, solo muestra eventos

  useEffect(() => {
    fetchEventos();
  }, []);


  // --- Calendario visual simple ---
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  // Popup visual para evento seleccionado
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Generar días del mes
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Agrupar eventos por día SOLO del mes actual
  const eventosPorDia = {};
  eventos.forEach(ev => {
    if (!ev.fecha_inicio) return;
    const fecha = ev.fecha_inicio.split("T")[0];
    const [evYear, evMonth, evDay] = fecha.split("-").map(Number);
    if (evYear === year && evMonth === month + 1) {
      if (!eventosPorDia[evDay]) eventosPorDia[evDay] = [];
      eventosPorDia[evDay].push(ev);
    }
  });

  function cambiarMes(offset) {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + offset, 1);
      return newMonth;
    });
  }


  return (
    <div className="eventos_page-simple" style={{ display: 'flex', flexDirection: 'row', gap: '32px', alignItems: 'flex-start', background: '#f4f8fd', minHeight: '100vh' }}>
      <div className="eventos-col-izq-simple" style={{ flex: 1, minWidth: 340, maxWidth: 500 }}>
        {isCEE && (
          <button className="eventos-addbtn-simple" onClick={handleCreateEvento}>Añadir Evento</button>
        )}
        <div className="eventos-lista-tabla-box">
          <h3 className="eventos-lista-titulo">Todos los eventos</h3>
          {Array.isArray(eventos) && eventos.length > 0 ? (
            <table className="eventos-lista-tabla">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Hora</th>
                  {isCEE && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {eventos.map(evento => (
                  <tr key={evento.id}>
                    <td>{evento.title}</td>
                    <td>{evento.fecha_inicio}</td>
                    <td>{evento.hora_inicio} - {evento.hora_fin}</td>
                    {isCEE && (
                      <td>
                        <button className="evento-btn-simple edit" onClick={() => handleEditEvento(evento)}>Editar</button>
                        <button className="evento-btn-simple delete" onClick={() => handleDeleteEvento(evento.id)}>Eliminar</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="evento-lista-vacio">No hay eventos disponibles</div>
          )}
        </div>
      </div>
      {/* Columna derecha: calendario */}
      <div className="eventos-col-der-calendario" style={{ flex: 2, minWidth: 600, maxWidth: 1200, marginTop: 0, background: 'linear-gradient(135deg, #d1c4e9 0%, #90caf9 100%)', borderRadius: 12, boxShadow: '0 2px 12px #b3d8fd33', padding: 24 }}>
        <div className="eventos-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ margin: 0, color: '#0d2346' }}>Calendario de eventos</h2>
        </div>
        {/* Calendario visual */}
        <div className="eventos-calendar" style={{ maxWidth: 1100, minWidth: 600, width: '100%', background: 'linear-gradient(135deg, #ede7f6 0%, #90caf9 100%)', borderRadius: 10, boxShadow: '0 2px 8px #1976d244', padding: '16px 6px 18px 6px' }}>
          <div className="calendar-controls">
            <button onClick={() => cambiarMes(-1)}>&lt;</button>
            <span style={{ color: '#512da8', fontWeight: 'bold', fontSize: '1.2em' }}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => cambiarMes(1)}>&gt;</button>
          </div>
          {/* Nombres de los días de la semana */}
          <div className="calendar-grid">
            {/* Fila de días de la semana */}
            {[
              "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
            ].map((d, i) => (
              <div key={"header-"+i} className="calendar-day calendar-header" style={{fontWeight:'bold', color:'#512da8', background:'#ede7f6', textAlign:'center', fontSize:'1.1em', borderBottom:'2px solid #90caf9'}}>{d}</div>
            ))}
            {/* Días vacíos antes del primer día del mes */}
            {[...Array(firstDayOfWeek).keys()].map(i => (
              <div key={"empty-"+i} className="calendar-day empty"></div>
            ))}
            {/* Días del mes */}
            {daysArray.map(day => (
              <div key={day} className="calendar-day" style={{ background: '#f4f8fd', border: '1px solid #90caf9' }}>
                <div className="calendar-day-number" style={{ color: '#512da8' }}>{day}</div>
                <div className="calendar-events">
                  {(eventosPorDia[day] || []).map(ev => (
                    <div
                      key={ev.id}
                      className="calendar-event"
                      onClick={() => setEventoSeleccionado(ev)}
                      style={{ cursor: 'pointer', background: 'linear-gradient(90deg, #ede7f6 60%, #90caf9 100%)', borderLeft: '4px solid #512da8', color: '#0d2346' }}
                    >
                      <strong style={{ color: '#512da8' }}>{ev.title}</strong>
                      <div style={{ fontSize: '0.8em', color: '#1976d2' }}>{ev.hora_inicio} - {ev.hora_fin}</div>
                      {isCEE ? <>
                        <button className="edit" onClick={e => { e.stopPropagation(); handleEditEvento(ev); }} style={{marginRight: 4, background: '#512da8', color: '#fff' }}>Editar</button>
                        <button className="delete" onClick={e => { e.stopPropagation(); handleDeleteEvento(ev.id); }} style={{ background: '#f44336', color: '#fff' }}>Eliminar</button>
                      </> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}

      {/* Popup visual para evento seleccionado */}
      {eventoSeleccionado && (
        <div className="evento-popup-overlay" onClick={() => setEventoSeleccionado(null)}>
          <div className="evento-popup-card" onClick={e => e.stopPropagation()}>
            <button className="evento-popup-close" onClick={() => setEventoSeleccionado(null)}>&times;</button>
            <h3 style={{marginTop:0, marginBottom:8, color:'#512da8'}}>{eventoSeleccionado.title}</h3>
            <div style={{marginBottom:8, color:'#222'}}>{eventoSeleccionado.description}</div>
            <div style={{fontWeight:'bold', color:'#512da8'}}>
              {eventoSeleccionado.fecha_inicio} | {eventoSeleccionado.hora_inicio} - {eventoSeleccionado.hora_fin}
            </div>
          </div>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;