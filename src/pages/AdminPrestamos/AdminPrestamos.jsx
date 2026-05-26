import { useState, useEffect } from 'react';
import ModalNotificacion from '../../components/ModalNotificacion/ModalNotificacion';
import '../AdminLibros/AdminLibros.css'; 

function AdminPrestamos({ usuarioLogueado }) {
  const [formPrestamo, setFormPrestamo] = useState({ usuarioId: '', libroId: '' });
  const [idDevolucion, setIdDevolucion] = useState('');
  
  // 🔥 NUEVO: Estado para guardar la lista de préstamos de la tabla
  const [prestamos, setPrestamos] = useState([]);

  const [modal, setModal] = useState({
    mostrar: false,
    tipo: 'success',
    titulo: '',
    mensaje: ''
  });

  // 🔥 NUEVO: Función para traer los préstamos de MySQL
  const obtenerPrestamos = async () => {
    try {
      const response = await fetch('http://localhost:5224/api/Prestamos');
      if (response.ok) {
        const data = await response.json();
        setPrestamos(data);
      }
    } catch (error) {
      console.error("Error al cargar la tabla de préstamos:", error);
    }
  };

  // Se ejecuta automáticamente al abrir la página
  useEffect(() => {
    obtenerPrestamos();
  }, []);

  const manejarSolicitudPrestamo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5224/api/Prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: parseInt(formPrestamo.usuarioId),
          libroId: parseInt(formPrestamo.libroId)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setModal({
          mostrar: true,
          tipo: 'success',
          titulo: 'Préstamo Exitoso',
          mensaje: data.mensaje
        });
        setFormPrestamo({ usuarioId: '', libroId: '' }); 
        obtenerPrestamos(); // 🔥 Recargamos la tabla al prestar
      } else {
        setModal({
          mostrar: true,
          tipo: 'danger',
          titulo: 'Error en el préstamo',
          mensaje: data.mensaje
        });
      }
    } catch (error) {
      console.error("Error al registrar préstamo:", error);
    }
  };

  const manejarDevolucion = async (e) => {
    e.preventDefault();
    if (!idDevolucion) return;

    try {
      const response = await fetch(`http://localhost:5224/api/Prestamos/devolver/${idDevolucion}`, {
        method: 'PUT'
      });

      const data = await response.json();

      if (response.ok) {
        setModal({
          mostrar: true,
          tipo: 'success',
          titulo: 'Devolución Exitosa',
          mensaje: data.mensaje
        });
        setIdDevolucion(''); 
        obtenerPrestamos(); // 🔥 Recargamos la tabla al devolver
      } else {
        setModal({
          mostrar: true,
          tipo: 'danger',
          titulo: 'Error en la devolución',
          mensaje: data.mensaje
        });
      }
    } catch (error) {
      console.error("Error al devolver libro:", error);
    }
  };

  const cerrarModal = () => setModal(prev => ({ ...prev, mostrar: false }));

  // Formatear la fecha para que se vea bonita en la tabla
  const formatearFecha = (fechaString) => {
    if (!fechaString) return '—';
    const opciones = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(fechaString).toLocaleDateString('es-MX', opciones);
  };

  return (
    <>
      <main className="page">
        <header className="pageHead">
          <div>
            <p className="kicker">Panel Operativo</p>
            <h1>Gestión de Préstamos</h1>
            <p className="pageText">
              Registra nuevos préstamos, procesa devoluciones y monitorea el historial de movimientos de la biblioteca.
            </p>
          </div>
          <div className="headBadge">
            <span className="roleTag">{usuarioLogueado?.rol}</span>
            <span className="userTag">{usuarioLogueado?.nombre}</span>
          </div>
        </header>

        {/* Zona de Formularios (Lado a Lado usando Grid) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          <section className="admin-card m-0">
            <div className="cardTitle"><h2>Registrar Nuevo Préstamo</h2></div>
            <form className="formCrud" onSubmit={manejarSolicitudPrestamo}>
              <div className="grid">
                <label className="field wide">
                  <span>ID Usuario (Alumno)</span>
                  <input type="number" required value={formPrestamo.usuarioId} onChange={(e) => setFormPrestamo({...formPrestamo, usuarioId: e.target.value})} placeholder="Ej. 1" />
                </label>
                <label className="field wide">
                  <span>ID Libro</span>
                  <input type="number" required value={formPrestamo.libroId} onChange={(e) => setFormPrestamo({...formPrestamo, libroId: e.target.value})} placeholder="Ej. 1" />
                </label>
              </div>
              <div className="formActions">
                <button className="btn primary" type="submit">Procesar Préstamo</button>
              </div>
            </form>
          </section>

          <section className="admin-card m-0">
            <div className="cardTitle">
              <h2>Procesar Devolución</h2>
            </div>
            <form className="formCrud" onSubmit={manejarDevolucion}>
              <div className="grid">
                <label className="field wide">
                  <span>ID del Préstamo a devolver</span>
                  <input type="number" required value={idDevolucion} onChange={(e) => setIdDevolucion(e.target.value)} placeholder="Ej. 1" />
                </label>
              </div>
              <div className="formActions">
                <button className="btn primary" type="submit" style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}>Confirmar Devolución</button>
              </div>
            </form>
          </section>

        </div>

        {/* 🔥 NUEVO: SECCIÓN DE LA TABLA */}
        <section className="admin-card">
          <div className="cardTitle">
            <h2>Historial de Préstamos</h2>
            <span className="hint">Hay {prestamos.length} movimiento(s) registrado(s).</span>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>ID Préstamo</th>
                  <th>ID Usuario</th>
                  <th>Título del Libro</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {prestamos.length > 0 ? (
                  prestamos.map((prestamo) => (
                    <tr key={prestamo.id}>
                      <td><strong>#{prestamo.id}</strong></td>
                      <td>{prestamo.usuarioId}</td>
                      <td>{prestamo.titulo}</td>
                      <td>{formatearFecha(prestamo.fechaPrestamo)}</td>
                      <td>{formatearFecha(prestamo.fechaDevolucion)}</td>
                      <td>
                        <span className={`pill ${prestamo.estado === 'Activo' ? 'warn' : 'ok'}`}>
                          {prestamo.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="emptyRow">No hay préstamos registrados aún.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </main>

      <ModalNotificacion 
        mostrar={modal.mostrar}
        tipo={modal.tipo}
        titulo={modal.titulo}
        mensaje={modal.mensaje}
        alCancelar={cerrarModal}
        alAceptar={cerrarModal}
      />
    </>
  );
}

export default AdminPrestamos;