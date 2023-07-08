import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";

const AuthContext = createContext(); // Como se va a llamar el context de ese Provider

// Componente que va a tener los componentes de la APP
const AuthProvider = ({children}) => {
    const [cargando, setCargando] = useState(true)
    const [auth, setAuth] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('apv_token')
            if(!token) {
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const {data} = await clienteAxios('/veterinarios/perfil', config)
                setAuth(data)
                navigate('/admin')
            } catch (error) {
                console.log(error.response.data.msg)
                setAuth({})
            }

            setCargando(false)
        }
        autenticarUsuario()
    },[])

    if (cargando) {
        // No muestra nada mientras se verifica la autenticación
        return null;
    }

    // Funcion para cerrar sesion de la pagina principal
    const cerrarSesion = () => {
        localStorage.removeItem('apv_token')
        setAuth({})
    }

    const actualizarPerfil = async datos => {
        const token = localStorage.getItem('apv_token')
        if(!token) {
            setCargando(false)
            return
        }

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const url = `/veterinarios/perfil/${datos._id}`
            const { data } = await clienteAxios.put(url, datos, config )

            return({
                msg: 'Almacenado Correctamente'
            });

        } catch (error) {
            return({
                msg: error.response.data.msg,
                error:true
            })
        }
    }

    // Almacenar nueva contraseña
    const guardarPassword = async (datos)=> {
        const token = localStorage.getItem('apv_token')
        if(!token) {
            setCargando(false)
            return
        }

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const url = '/veterinarios/actualizar-password'
            const { data } = await clienteAxios.put(url, datos, config)

            return({
                msg:data.msg
            })
        } catch (error) {
            return({
                msg: error.response.data.msg,
                error:true
            })
        }
    }

    return(
        // Va a retornar el context 
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando, 
                cerrarSesion, 
                actualizarPerfil,
                guardarPassword
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext;