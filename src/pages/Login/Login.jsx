import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Password from '../../components/Password/Password';
import Footer from '../../components/Footer/Footer'; 
import './Login.css';

function Login({ alLoguearCorrectamente }) {
  const [usuarioInput, setUsuarioInput] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError(false);

    try {
      /* 🔥 CAMBIO AQUÍ: Cambiado a http://localhost:5224 para evitar problemas con SSL */
      const response = await fetch('http://localhost:5224/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Correo: usuarioInput,
          Contrasena: password
        }),
      });

      if (response.ok) {
        const datosUsuario = await response.json();
        alLoguearCorrectamente(datosUsuario);
        navigate('/');
      } else {
        const errData = await response.json();
        setMensajeError(errData.mensaje || 'Usuario y/o contraseña incorrectos');
        setError(true);
      }
    } catch (err) {
      setMensajeError('Error al conectar con la API.');
      setError(true);
    }
  };

  return (
    <>
      <div className="auth">
        <div className="card">
          <div className="head">
            <h1>BiblioPlus</h1>
            <p>Inicia sesión para continuar</p>
          </div>

          <form onSubmit={manejarLogin} className="form">
            <div className="field">
              <span>Usuario / Correo</span>
              <input 
                type="text" 
                placeholder="ejemplo@itsur.com" 
                value={usuarioInput}
                onChange={(e) => setUsuarioInput(e.target.value)}
              />
            </div>

            <div className="field">
              <span>Contraseña</span>
              <Password 
                valorInicial={password} 
                cambioPassword={setPassword} 
                estadoInicial="Ocultar" 
              />
            </div>

            <div className="row-options">
              <label className="check">
                <input type="checkbox" /> Recordarme
              </label>
              <a href="#" className="link">¿Olvidaste tu contraseña?</a>
            </div>

            {error && <p className="error-text">{mensajeError}</p>}

            <button type="submit" className="btn-login">Aceptar</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;