import { BrowserRouter, Routes, Route} from 'react-router-dom';
import AuthLayout from './layout/AuthLayout';
import RutaProtegida from './layout/RutaProtegida';

//Rutas Publicas
import Login from './paginas/Login';
import Registrar from './paginas/Registrar';
import ConfirmarCuenta from './paginas/ConfirmarCuenta';
import OlvidePassword from './paginas/OlvidePassword';
import NuevoPassword from './paginas/NuevoPassword';

// Rutas Privadas
import AdministrarPacientes from './paginas/AdministrarPacientes';

import { AuthProvider } from './context/AuthProvider';
import { PacientesProvider } from './context/PacientesProvider';

// Modificar informacion del usuario
import EditarPerfil from './paginas/EditarPerfil';
import CambiarPassword from './paginas/CambiarPassword';

function App() {

  return (
    <BrowserRouter> 
        <AuthProvider>
          <PacientesProvider>
            <Routes>
                {/* Route con las rutas publicas*/}
                <Route path='/' element={<AuthLayout />}> {/* Componente padre */}
                  <Route index element={<Login />}/> {/*Ruta principal por el index  */}
                  <Route path='registrar' element={<Registrar />}/>
                  <Route path='forgot-password' element={<OlvidePassword />}/>
                  <Route path='forgot-password/:id' element={<NuevoPassword />}/>
                  <Route path='confirmar/:id' element={<ConfirmarCuenta />}/>
                </Route>

                {/* Route con las rutas privadas(El usuario debe de estrar autenticado)*/}
                <Route path='/admin' element={<RutaProtegida />}>
                  <Route index element={<AdministrarPacientes />}/> {/*Ruta principal por el index  */}
                  <Route path='perfil' element={<EditarPerfil />}/>
                  <Route path='cambiar-password' element={<CambiarPassword />}/>
                </Route>
            </Routes>
          </PacientesProvider>
        </AuthProvider>
    </BrowserRouter>
  )
}

export default App
