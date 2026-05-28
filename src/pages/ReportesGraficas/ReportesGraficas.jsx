import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ReportesGraficas.css';
import BotonTabla from '../../components/reportes/BotonTabla';
import TablaDisponibilidad from '../../components/reportes/TablaDisponibilidad';
import TablaMorosidad from '../../components/reportes/TablaMorosidad';
import TablaLibrosRotacion from '../../components/reportes/TablaLibrosRotacion';
import TablaDemandaPerfil from '../../components/reportes/TablaDemandaPerfil';

function ReportesGraficas({ usuarioLogueado }) {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState('');
  const [datosPastel, setDatosPastel] = useState([]);
  const [datosLineas, setDatosLineas] = useState([]);
  const reporteRef = useRef();
  const [tablaActiva, setTablaActiva] = useState(null);

  const COLORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1975', '#00E5FF'];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const response = await fetch('http://localhost:5224/api/Libros');
        if (response.ok) {
          const listaLibros = await response.json();
          setLibros(listaLibros);
          
          if (listaLibros.length > 0) {
            setLibroSeleccionado(listaLibros[0].id.toString()); 
          }

          const conteoCategorias = {};
          listaLibros.forEach(libro => {
            const cat = libro.categoria || 'Sin Categoría';
            conteoCategorias[cat] = (conteoCategorias[cat] || 0) + 1;
          });

          const formatearPastel = Object.keys(conteoCategorias).map(cat => ({
            name: cat,
            value: conteoCategorias[cat]
          }));

          const top5Categorias = formatearPastel
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
          setDatosPastel(top5Categorias);
        }
      } catch (error) {
        console.error("Error al cargar libros para reportes:", error);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (!libroSeleccionado) return;

    const factor = parseInt(libroSeleccionado) % 3;
    
    const historialSimulado = [
      { mes: 'Ene', solicitudes: 2 + factor },
      { mes: 'Feb', solicitudes: 5 * (factor + 1) },
      { mes: 'Mar', solicitudes: 12 - factor },
      { mes: 'Abr', solicitudes: 8 + factor * 2 },
      { mes: 'May', solicitudes: 18 + factor } 
    ];

    setDatosLineas(historialSimulado);
  }, [libroSeleccionado]);

  const exportarPDF = () => {
    const elemento = reporteRef.current;
    
    html2canvas(elemento, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const anchoPdf = pdf.internal.pageSize.getWidth();
      const altoPdf = (canvas.height * anchoPdf) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, anchoPdf, altoPdf);
      pdf.save(`Reporte_Inventario_BiblioPlus_${new Date().toLocaleDateString()}.pdf`);
    });
  };

  return (
    <main className="page">
      <header className="pageHead d-flex justify-content-between align-items-center">
        <div>
          <p className="kicker">Módulo de Estadísticas</p>
          <h1>Reportes Gráficos</h1>
          <p className="pageText">
            Visualiza el rendimiento de la biblioteca. Analiza las categorías más populares, el historial de demanda y los niveles de inventario físico.
          </p>
        </div>
        <button className="btn primary" onClick={exportarPDF}>
          📥 Exportar Reporte a PDF
        </button>
      </header>

      <div ref={reporteRef} className="reporte-container" style={{ padding: '10px' }}>

        <div className="dashboard-grid">
          
          <section className="admin-card grafica-box">
            <div className="cardTitle">
              <h2>Top 5 Categorías más Populares</h2>
            </div>
            <div className="canvas-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosPastel}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosPastel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} libro(s)`, 'Cantidad']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="admin-card grafica-box">
            <div className="cardTitle d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h2>Demanda Temporal del Libro</h2>
              </div>
              <div className="field m-0" style={{ minWidth: '220px' }}>
                <select 
                  value={libroSeleccionado} 
                  onChange={(e) => setLibroSeleccionado(e.target.value)}
                >
                  {libros.map((libro) => (
                    <option key={libro.id} value={libro.id}>
                      {libro.titulo}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="canvas-wrap">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={datosLineas} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [`${value} solicitudes`, 'Préstamos']} />
                  <Area type="monotone" dataKey="solicitudes" stroke="#8884d8" fillOpacity={1} fill="url(#colorSol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <section className="admin-card" style={{ marginTop: '24px' }}>
          <div className="cardTitle">
             <div>
                <BotonTabla
                  active={tablaActiva === 'disponibilidad'}
                  onClick={() => setTablaActiva('disponibilidad')}
                >
                  DISPONIBILIDAD
                </BotonTabla>

                <BotonTabla
                  active={tablaActiva === 'morosidad'}
                  onClick={() => setTablaActiva('morosidad')}
                >
                  MOROSIDAD
                </BotonTabla>

                <BotonTabla
                  active={tablaActiva === 'rotacion'}
                  onClick={() => setTablaActiva('rotacion')}
                >
                  LIBROS FANTASMA / ROTACIÓN
                </BotonTabla>

                <BotonTabla
                  active={tablaActiva === 'demanda'}
                  onClick={() => setTablaActiva('demanda')}
                >
                  DEMANDA POR PERFIL
                </BotonTabla>
              </div>
            <h2>Reportes de Biblioteca</h2>
            <span className="hint">Selecciona un reporte para visualizar su tabla correspondiente.</span>
          </div>
            {tablaActiva === 'disponibilidad' && (
              <TablaDisponibilidad libros={libros} />
            )}

            {tablaActiva === 'morosidad' && (
              <TablaMorosidad />
            )}

            {tablaActiva === 'rotacion' && (
              <TablaLibrosRotacion />
            )}

            {tablaActiva === 'demanda' && (
              <TablaDemandaPerfil />
            )}
        </section>
      </div>
    </main>
  );
}

export default ReportesGraficas;