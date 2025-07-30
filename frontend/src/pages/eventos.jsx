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
  // Si el usuario no es CEE, solo muestra eventos públicos (no filtrar, solo oculta botones)

  useEffect(() => {
    fetchEventos();
  }, []);


  // --- Calendario visual simple ---
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

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
    <div className="eventos_page" style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 40, width: '100%', maxWidth: '1800px', margin: '180px auto 0 auto' }}>
      {/* Columna izquierda: botón y lista de eventos */}
      <div style={{ minWidth: 340, maxWidth: 400, width: '100%', marginLeft: 0, marginRight: 0, paddingLeft: 0 }}>
        {isCEE && (
          <button className="eventos-addbtn" style={{ margin: '80px 0 38px 0', width: '100%' }} onClick={handleCreateEvento}>Añadir Evento</button>
        )}
        <div className="eventos-lista">
          <h3 style={{marginTop: 0, marginBottom: 10}}>Todos los eventos</h3>
          {Array.isArray(eventos) && eventos.length > 0 ? (
            <ul style={{listStyle: 'none', padding: 0}}>
              {eventos.map(evento => (
                <li key={evento.id} style={{
                  background: '#f7f7f7',
                  marginBottom: 10,
                  borderRadius: 6,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                  padding: '10px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <div style={{fontWeight: 'bold', color: '#4caf50', fontSize: '1.1em'}}>{evento.title}</div>
                  <div style={{fontSize: '0.98em', color: '#222'}}>{evento.description}</div>
                  <div style={{fontSize: '0.95em', color: '#555'}}>
                    {evento.fecha_inicio} | {evento.hora_inicio} - {evento.hora_fin}
                  </div>
                  {isCEE ? (
                    <div style={{marginTop: 4}}>
                      <button className="edit" onClick={() => handleEditEvento(evento)} style={{marginRight: 6}}>Editar</button>
                      <button className="delete" onClick={() => handleDeleteEvento(evento.id)}>Eliminar</button>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <div style={{color: '#888', fontStyle: 'italic'}}>No hay eventos disponibles</div>
          )}
        </div>
      </div>
      {/* Columna derecha: calendario */}
      <div style={{ flex: 1, minWidth: 600, maxWidth: 1200, marginTop: 60 }}>
        <div className="eventos-header" style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ margin: 0 }}>Calendario de eventos</h2>
        </div>
        {/* Calendario visual */}
        <div className="eventos-calendar" style={{ maxWidth: 1100, minWidth: 600, width: '100%' }}>
          <div className="calendar-controls">
            <button onClick={() => cambiarMes(-1)}>&lt;</button>
            <span>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
            <button onClick={() => cambiarMes(1)}>&gt;</button>
          </div>
          {/* Nombres de los días de la semana */}
          <div className="calendar-weekdays" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            width: '100%',
            marginBottom: 8,
            fontWeight: 'bold',
            color: '#388e3c',
            fontSize: '1.15em',
            textAlign: 'center',
            letterSpacing: '1px',
            background: '#e8f5e9',
            borderRadius: 6,
            padding: '8px 0 8px 0',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}>
            {["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {[...Array(firstDayOfWeek).keys()].map(i => (
              <div key={"empty-"+i} className="calendar-day empty"></div>
            ))}
            {daysArray.map(day => (
              <div key={day} className="calendar-day">
                <div className="calendar-day-number">{day}</div>
                <div className="calendar-events">
                  {(eventosPorDia[day] || []).map(ev => (
                    <div key={ev.id} className="calendar-event">
                      <strong>{ev.title}</strong>
                      <div style={{ fontSize: '0.8em' }}>{ev.hora_inicio} - {ev.hora_fin}</div>
                      {isCEE ? <>
                        <button className="edit" onClick={() => handleEditEvento(ev)} style={{marginRight: 4}}>Editar</button>
                        <button className="delete" onClick={() => handleDeleteEvento(ev.id)}>Eliminar</button>
                      </> : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;