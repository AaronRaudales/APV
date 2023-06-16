import { useState, useEffect} from 'react'
import {Link, useParams} from 'react-router-dom'
import Alerta from '../components/Alerta';
import clienteAxios from '../config/axios';



const NuevoPassword = () => {
    const [password, setPassword] = useState('')
    const [alerta, setAlerta] = useState({})
    const [tokenValido, setTokenValido] = useState(false)
    const [passwordModificado, setPasswordModificado] = useState(false)

    const params = useParams()
    const {id} = params; // Le llamamos id por = <Route path='confirmar/:id' element={<ConfirmarCuenta />}/>

    useEffect(() => { // El useEffect lo utilizamos para validar el token
        const comprobarToken = async()=> {
            try {
                const url = `/veterinarios/forgot-password/${id}`
                await clienteAxios(url) // por default es get
                setAlerta({
                    msg: 'Coloca tu nuevo password'
                })
                setTimeout(() => {
                    setAlerta({})
                }, 2000);
                setTokenValido(true)
            } catch (error) {
                setAlerta({
                    msg: 'Hubo un error con el enlace',
                    error: true
                  })
            }
        }
        comprobarToken();
    },[])

    const handleSubmit = async e => {
        e.preventDefault()

        if(password.length < 6){
            setAlerta({msg: 'El password debe de contener minimo 6 caracteres', error: true})
            setTimeout(() => {
                setAlerta({})
            }, 2000);
            return
        }

        try {
            const url = `/veterinarios/forgot-password/${id}`
            const {data} = await clienteAxios.post(url, {password})
            setAlerta({
                msg: data.msg
            })
            setPasswordModificado(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg, 
                error: true
            })
        }
    }

    const { msg } =alerta

  return (
    <>
        <div>
            <h1 className='text-indigo-600 font-black text-6xl '>Restablece tu password y no pierdas Acceso a {""} 
            <span className='text-black'>tus  Pacientes</span>
            </h1>
        </div>
        <div className='mt-20 md:mt-5 shadow-lg px-5 py-2 rounded-xl bg-white'>
            {msg && <Alerta 
                alerta={alerta}
            />}
            { tokenValido && ( // Si el token es valido va a retornar el formulario, si no es asi, no lo mostrara
                <>

                    <form onSubmit={handleSubmit}>
                        <div className='my-5'>
                            <label className="uppercase text-gray-600 block text-base font-bold">Nuevo Password
                                <input 
                                type="password" 
                                placeholder='Nuevo Password' 
                                className='border w-full p-3 mt-3 bg-gray-50 rounded-xl font-normal'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                />
                            </label>
                        </div>
                        <input type="submit" value="Guardar Password" className='bg-indigo-700 w-full py-3 rounded-xl text-base text-white uppercase font-bold mt-5 mb-6 hover: cursor-pointer hover:bg-indigo-900 px-10 md:w-auto'/>
                    </form>
                    {passwordModificado && (
                        <Link 
                            className='block text-center font-bold my-5 text-gray-500 '
                            to="/">Iniciar Sesion
                        </Link>
                    )

                    }
                </>
            )}
            
        </div>
        
    </>
  )
}

export default NuevoPassword