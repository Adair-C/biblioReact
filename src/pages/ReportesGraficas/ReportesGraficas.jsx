import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './ReportesGraficas.css';

function ReportesGraficas({ usuarioLogueado }) {
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState('');
  const [datosPastel, setDatosPastel] = useState([]);
  const [datosLineas, setDatosLineas] = useState([]);
  const reporteRef = useRef(); // Referencia para capturar la pantalla y exportar a PDF

  // Colores estéticos para la gráfica de pastel
  const COLORES = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1975', '#00E5FF'];

  useEffect(() => {
    // 1. Obtener los libros de tu API en el puerto HTTP 5224
    const cargarDatos = async () => {
      try {
        const response = await fetch('http://localhost:5224/api/Libros');
        if (response.ok) {
          const listaLibros = await response.json();
          setLibros(listaLibros);
          
          if (listaLibros.length > 0) {
            setLibroSeleccionado(listaLibros[0].id.toString()); // Seleccionar el primero por defecto
          }

          // 2. Procesar datos para la Gráfica de Pastel (Conteo por Categoría)
          const conteoCategorias = {};
          listaLibros.forEach(libro => {
            const cat = libro.categoria || 'Sin Categoría';
            conteoCategorias[cat] = (conteoCategorias[cat] || 0) + 1;
          });

          const formatearPastel = Object.keys(conteoCategorias).map(cat => ({
            name: cat,
            value: conteoCategorias[cat]
          }));
          setDatosPastel(formatearPastel);
        }
      } catch (error) {
        console.error("Error al cargar libros para reportes:", error);
      }
    };

    cargarDatos();
  }, []);

  // 3. Simular o cargar el historial de tiempo cada vez que cambie el libro seleccionado
  useEffect(() => {
    if (!libroSeleccionado) return;
    
    // Generamos datos aleatorios lógicos basados en el ID del libro para que cambie la gráfica
    const factor = parseInt(libroSeleccionado) % 3;
    const historialSimulado = [
      { mes: 'Ene', solicitudes: 2 + factor },
      { mes: 'Feb', solicitudes: 5 * (factor + 1) },
      { mes: 'Mar', solicitudes: 12 - factor },
      { mes: 'Abr', solicitudes: 8 + factor * 2 },
      { mes: 'May', solicitudes: 15 + factor }, // Picos en mayo por exámenes del ITSUR
      { mes: 'Jun', solicitudes: 3 }
    ];

    setDatosLineas(historialSimulado);
  }, [libroSeleccionado]);

  // 4. Función para exportar toda la vista a PDF
  const exportarPDF = () => {
    const elemento = reporteRef.current;
    
    html2canvas(elemento, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const anchoPdf = pdf.internal.pageSize.getWidth();
      const altoPdf = (canvas.height * anchoPdf) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, anchoPdf, altoPdf);
      pdf.save(`Reporte_BiblioPlus_${new Date().toLocaleDateString()}.pdf`);
    });
  };

  return (
    <main className="page">
      <header className="pageHead d-flex justify-content-between align-items-center">
        <div>
          <p className="kicker">Módulo de Estadísticas</p>
          <h1>Reportes Gráficos</h1>
          <p className="pageText">
            Visualiza el rendimiento de la biblioteca. Analiza las categorías más populares y el historial de demanda por título.
          </p>
        </div>
        <button className="btn primary" onClick={exportarPDF}>
          📥 Exportar Reporte a PDF
        </button>
      </header>

      {/* Contenedor que será capturado en el PDF */}
      <div ref={reporteRef} className="reporte-container">
        <div className="dashboard-grid">
          
          {/* GRÁFICA 1: PASTEL - CATEGORÍAS */}
          <section className="admin-card grafica-box">
            <div className="cardTitle">
              <h2>Libros por Categoría</h2>
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

          {/* GRÁFICA 2: ÁREA/LÍNEAS - PERIODOS POR LIBRO */}
          <section className="admin-card grafica-box">
            <div className="cardTitle d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <h2>Demanda Temporal del Libro</h2>
              </div>
              {/* SELECTOR DINÁMICO */}
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
      </div>
    </main>
  );
}

export default ReportesGraficas;