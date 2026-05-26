import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Footer from './components/Footer/Footer.jsx'

import ReportesGraficas from './pages/ReportesGraficas/ReportesGraficas';
import AdminPrestamos from './pages/AdminPrestamos/AdminPrestamos';
import Login from './pages/Login/Login';
import Principal from './pages/principal/Principal.jsx'
import AdminLibros from './pages/AdminLibros/AdminLibros';
import PerfilUsuario from './pages/PerfilUsuario/PerfilUsuario.jsx'

function App() {
  const [isLogged, setIsLogged] = useState(() => {
    return localStorage.getItem('isLogged') === 'true';
  });
  const [usuarioLogueado, setUsuarioLogueado] = useState(() => {
    const savedUser = localStorage.getItem('usuarioLogueado');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const alLoguearCorrectamente = (datosUsuario) => {
    setUsuarioLogueado(datosUsuario);
    setIsLogged(true);

    localStorage.setItem('isLogged', 'true');
    localStorage.setItem('usuarioLogueado', JSON.stringify(datosUsuario));
  };

  const cerrarSesion = () => {
    setIsLogged(false);
    setUsuarioLogueado(null);

    localStorage.removeItem('isLogged');
    localStorage.removeItem('usuarioLogueado');
  };

  return (
    <BrowserRouter>
      {isLogged && (
        <Navbar 
          usuarioLogueado={usuarioLogueado} 
          alCerrarSesion={cerrarSesion} 
        />
      )}
      <Routes>
        {!isLogged ? (
          
          <Route path="*" element={<Login alLoguearCorrectamente={alLoguearCorrectamente} />} />
        ) : (
         
          <>
            <Route path="/Inicio" element={<Principal usuarioLogueado={usuarioLogueado} />} />
            <Route path="/libros" element={<AdminLibros usuarioLogueado={usuarioLogueado} />} />
            <Route path="/reportes" element={<ReportesGraficas usuarioLogueado={usuarioLogueado} />} />
            <Route path="/prestamos" element={<AdminPrestamos usuarioLogueado={usuarioLogueado} />} />
            <Route path="/Perfil" element={<PerfilUsuario usuarioLogueado={usuarioLogueado} />} />

            {/* <Route path="/catalogo" element={
               <div style={{ padding: '40px', textAlign: 'center' }}>
                 <h2>Vista del Alumno</h2>
               </div>
            } /> */}
            
            <Route path="*" element={<Navigate to="/Inicio" />} />
          </>
        )}
      </Routes>
      {isLogged && <Footer />}
    </BrowserRouter>
  );
}

export default App;