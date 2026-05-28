import { useEffect, useState } from 'react';
import '../../pages/ReportesGraficas/ReportesGraficas.css';


function TablaLibrosRotacion() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarRotacion = async () => {
      try {
        const response = await fetch('http://localhost:5224/api/Reportes/libros-rotacion');

        if (!response.ok) {
          throw new Error('No se pudo cargar el reporte de rotación de libros.');
        }

        const data = await response.json();
        setDatos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarRotacion();
  }, []);

  if (cargando) {
    return <p className="hint">Cargando reporte de rotación de libros...</p>;
  }

  if (error) {
    return <p className="emptyRow">{error}</p>;
  }

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Título del Libro</th>
            <th>Autor</th>
            <th style={{ textAlign: 'center' }}>Total de Préstamos Realizados</th>
            <th style={{ textAlign: 'center' }}>Estado Actual</th>
            <th style={{ textAlign: 'center' }}>Ejemplares Disponibles</th>
          </tr>
        </thead>

        <tbody>
          {datos.length > 0 ? (
            datos.map((item, index) => (
              <tr key={index}>
                <td>
                  <strong>{item.tituloLibro}</strong>
                </td>
                <td>{item.autor}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {item.totalPrestamosRealizados}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {item.estadoActual}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {item.ejemplaresDisponibles}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="emptyRow">
                No hay datos disponibles para analizar la rotación de libros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaLibrosRotacion;