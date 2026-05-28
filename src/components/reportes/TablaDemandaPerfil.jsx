import { useEffect, useState } from 'react';
import '../../pages/ReportesGraficas/ReportesGraficas.css';

function TablaDemandaPerfil() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDemandaPerfil = async () => {
      try {
        const response = await fetch('http://localhost:5224/api/Reportes/demanda-perfil');

        if (!response.ok) {
          throw new Error('No se pudo cargar el reporte de demanda por perfil académico.');
        }

        const data = await response.json();
        setDatos(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    cargarDemandaPerfil();
  }, []);

  if (cargando) {
    return <p className="hint">Cargando reporte de demanda por perfil académico...</p>;
  }

  if (error) {
    return <p className="emptyRow">{error}</p>;
  }

  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Escuela</th>
            <th>Categoría del Libro</th>
            <th style={{ textAlign: 'center' }}>Total de Préstamos</th>
          </tr>
        </thead>

        <tbody>
          {datos.length > 0 ? (
            datos.map((item, index) => (
              <tr key={index}>
                <td>{item.escuela}</td>
                <td>{item.categoriaLibro}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>
                  {item.totalPrestamos}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="emptyRow">
                No hay datos suficientes para generar el reporte por perfil académico.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaDemandaPerfil;