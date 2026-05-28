import { useEffect, useState } from 'react';
import '../../pages/ReportesGraficas/ReportesGraficas.css';

function TablaMorosidad() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarMorosidad = async () => {
      try {
        const response = await fetch('http://localhost:5224/api/Reportes/morosidad');

        if (!response.ok) {
          throw new Error('No se pudo cargar el reporte de morosidad.');
        }

        const data = await response.json();
        setDatos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarMorosidad();
  }, []);

  if (cargando) {
    return <p className="hint">Cargando reporte de morosidad...</p>;
  }

  if (error) {
    return <p className="emptyRow">{error}</p>;
  }

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Nombre del Usuario</th>
            <th>Correo</th>
            <th>Título del Libro</th>
            <th>Fecha Límite</th>
            <th style={{ textAlign: 'center' }}>Días de Retraso</th>
          </tr>
        </thead>

        <tbody>
          {datos.length > 0 ? (
            datos.map((item, index) => (
              <tr key={index}>
                <td>{item.nombreUsuario}</td>
                <td>{item.correo}</td>
                <td>
                  <strong>{item.tituloLibro}</strong>
                </td>
                <td>
                  {new Date(item.fechaLimite).toLocaleDateString('es-MX')}
                </td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {item.diasRetraso} días
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="emptyRow">
                No hay usuarios con préstamos vencidos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaMorosidad;