import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alerta, setAlerta] = useState({})

  const navigate = useNavigate()
  const { setAuth} = useAuth()
  
  const handleSubmit = async e => {
    e.preventDefault();

    if([email, password].includes('')){
      setAlerta({ msg: 'Todos los campos son obligatorios', error: true});
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    return;
    }

    setAlerta({})

    try {
      const {data}= await clienteAxios.post('/veterinarios/login', {email, password})
      localStorage.setItem('apv_token', data.token)
      setAuth(data)
      navigate('/admin')

    } catch (error) {
      setAlerta({
        msg: error.response.data.msg, 
        error: true
      })
    }
  } 
  
  const { msg } = alerta;

  return (
    <>
      <div>
        <h1 className='text-indigo-600 font-black text-6xl '>Inicia Sesión y Administra tus {""} 
          <span className='text-black'>Pacientes</span>
        </h1>
      </div>

      <div className='mt-20 md:mt-5 shadow-lg px-5 py-5 rounded-xl bg-white'>
          { msg && <Alerta 
                alerta={alerta}
          />}
          <form onSubmit={handleSubmit}>
            <div className='my-5'>
              <label className="uppercase text-gray-600 block text-xl font-bold">Email</label>
              <input 
                  type="email" 
                  placeholder='Email de Registro' 
                  className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal outline-indigo-600'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className='my-10'>
              <label className="uppercase text-gray-600 block text-xl font-bold">Password</label>
              <input 
                  type="password" 
                  placeholder='Tu Password' 
                  className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal outline-indigo-600'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
              />
            </div>

            <input type="submit" value="Iniciar Sesion" className='bg-indigo-700 w-full py-3 rounded-xl text-white uppercase font-bold mt-5 hover: cursor-pointer hover:bg-indigo-900 md:w-auto px-10'/>
          </form>

          <div>
            <nav className='mt-4 lg:flex lg:justify-between'>
              <Link 
                  className='block text-center my-5 text-gray-500 '
                  to="/registrar">¿No tienes una cuenta? Registrate
              </Link>
              <Link
                  className='block text-center my-5 text-gray-500 '
                  to="/forgot-password">Olvide mi contraseña
              </Link>
            </nav>
          </div>

      </div> 
       
    </>
  )
}

export default Login