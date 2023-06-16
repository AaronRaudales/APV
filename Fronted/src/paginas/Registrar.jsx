import { useState } from 'react'
import {Link} from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';

const Registrar = () => {
  const [nombre, setNombre] = useState('')
  const [email, setEmail ] = useState('')
  const [password, setPassword ] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')

  // El state para las alertas
  const [alerta, setAlerta] = useState({})

  const handleSubmit = async e => {
    e.preventDefault();

    // Campos Vacios
    if([nombre, email, password, repetirPassword].includes('')){
        setAlerta({ msg: '¡Advertencia! Hay campos vacios', error: true});
        setTimeout(() => {
          setAlerta({});
        }, 3000);
      return;
    }

    if(password !== repetirPassword){
      setAlerta({ msg: 'Los password no son iguales', error: true});
      setTimeout(() => {
        setAlerta({});
      }, 3000);
      return;
    }

    if(password.length < 6){
      setAlerta({ msg: 'Password muy corto, minimo 8 caracteres', error: true});
      setTimeout(() => {
        setAlerta({});
      }, 3000);
      return;
    }

      setAlerta({})

      // Crear el usuario en la api
      try {
        await clienteAxios.post('/veterinarios', {nombre, email, password}) // clienteAxios esta en la carpeta de config/axios

        setAlerta({
          msg: 'Creado Correctamente, revisa tu email', 
          error: false
        })
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg, 
          error: true
        })
      }
  }

  const { msg} = alerta;

  return (
    <>
      <div>
        <h1 className='text-indigo-600 font-black text-6xl '>Crea tu Cuenta y Administra tus {""} 
          <span className='text-black'>Pacientes</span>
        </h1>
      </div>

      <div className='mt-20 md:mt-5 shadow-lg px-5 py-2 rounded-xl bg-white'>
          { msg && <Alerta 
            alerta={alerta}
          />}
          

          <form 
            onSubmit={handleSubmit}
          >
          <div className='my-5'>
              <label className="uppercase text-gray-600 block text-base font-bold">Nombre
                <input 
                  type="text" 
                  placeholder='Nombre' 
                  className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal'
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                />
              </label>
            </div>
            <div className='my-5'>
              <label className="uppercase text-gray-600 block text-base font-bold">Email
                <input 
                  type="email" 
                  placeholder='Email de Registro' 
                  className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
            </div>

            <div className='my-5'>
              <label className="uppercase text-gray-600 block text-base font-bold">Password
                <input 
                  type="password" 
                  placeholder='Password' 
                  className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div className='my-5'>
              <label className="uppercase text-gray-600 block text-base font-bold">Confirmar Password
                <input 
                  type="password" 
                  placeholder='Repite tu password' 
                  className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal'
                  value={repetirPassword}
                  onChange={e => setRepetirPassword(e.target.value)}
                />
              </label>
            </div>


            <input type="submit" value="Crear Cuenta" className='bg-indigo-700 w-full py-3 rounded-xl text-base text-white uppercase font-bold mt-5 hover: cursor-pointer hover:bg-indigo-900 px-10 md:w-auto'/>
          </form>
          <nav className='mt-4 lg:flex lg:justify-between'>
              <Link 
                  className='block text-center my-5 text-gray-500 '
                  to="/">¿Ya tienes una cuenta? Inicia Sesion
              </Link>
              <Link
                  className='block text-center my-5 text-gray-500 '
                  to="/forgot-password">Olvide mi contraseña
              </Link>
            </nav>
      </div>

    </>
  )
};

export default Registrar;