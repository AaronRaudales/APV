import { useEffect, useState } from "react"
import AdminNav from "../components/AdminNav"
import useAuth from '../hooks/useAuth'
import Alerta from '../components/Alerta';

const EditarPerfil = () => {
    const { auth, actualizarPerfil} = useAuth()
    const [perfil, setPerfil]= useState({}) // Copia de auth para modificar al veterinario
    const [alerta, setAlerta] = useState({})

    useEffect(()=> {
        setPerfil(auth)
    }, [auth])

    const handleSubmit = async e=> {
        e.preventDefault();

        const { nombre, email } = perfil;

        if([nombre, email].includes('')){
            setAlerta({
                msg: 'Email y nombre son obligatorios', 
                error: true
            });
            return;
        }

        const resultado = await actualizarPerfil(perfil)
        setAlerta(resultado)
    }

    const { msg } = alerta;
  return (
    <>
        <AdminNav />
        <h2 className="font-black text-3xl text-center mt-10">Editar Perfil</h2>
        <p className="text-xl mt-5 mb-10 text-center">Modifica tu {''} 
            <span className="text-indigo-600 font-bold">Información aquí</span>
        </p> 

        <div className="flex justify-center">
            <div className="w-full md:w-1/2 bg-white rounded-lg p-5">
                {msg && <Alerta alerta={alerta} />}
                <form onSubmit={handleSubmit}>
                    <div className="my-3">
                        <label htmlFor="nombre" className="uppercase font-bold text-gray-600">Nombre</label>
                        <input 
                            type="text" 
                            className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                            id="nombre" 
                            name="nombre" // Es importante ya que mediante este atributo accedemos para poder modificarlo
                            value={perfil.nombre || ''}
                            onChange={e=> setPerfil({
                                ...perfil, // Hacemos una copia de lo que haya en el state
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>
                    <div className="my-3">
                        <label htmlFor="web" className="uppercase font-bold text-gray-600">Sitio web</label>
                        <input 
                            type="text" 
                            className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                            id="web"
                            name="web"
                            value={perfil.web || ''}
                            onChange={e=> setPerfil({
                                ...perfil, // Hacemos una copia de lo que haya en el state
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>
                    <div className="my-3">
                        <label htmlFor="telefono" className="uppercase font-bold text-gray-600">Telefono</label>
                        <input 
                            type="text" 
                            className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                            id="telefono"
                            name="telefono"
                            value={perfil.telefono || ''}
                            onChange={e=> setPerfil({
                                ...perfil, // Hacemos una copia de lo que haya en el state
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>
                    <div className="my-3">
                        <label htmlFor="email" className="uppercase font-bold text-gray-600">Email</label>
                        <input 
                            type="email" 
                            className="border bg-gray-50 w-full p-2 mt-5 rounded-lg"
                            id="email"
                            name="email"
                            value={perfil.email || ''}
                            onChange={e=> setPerfil({
                                ...perfil, // Hacemos una copia de lo que haya en el state
                                [e.target.name] : e.target.value
                            })}
                        />
                    </div>
                    <input 
                        type="submit"
                        value='Guardar Cambios' 
                        className="bg-indigo-700 px-10 py-3 font-bold text-white rounded-lg uppercase w-full mt-5 cursor-pointer"
                    />
                </form>
            </div>
        </div>
    </>
  )
}

export default EditarPerfil