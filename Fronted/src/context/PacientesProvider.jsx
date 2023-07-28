import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import deleteConfirmation from "../components/SweetAlertsUtils";
import useAuth from "../hooks/useAuth";


const PacientesContext = createContext();

export const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([]) // Un arreglo de pacientes
    const [pacienteEditado, setPacienteEditado] = useState({}) // Es para editar al usuario, un state con un solo paciente que viene desde paciente, cuando este se itero en ListadoPacientes
    const { auth} = useAuth()

    useEffect(() => {
        const obtenerPacientes = async() => {
            try {
                const token = localStorage.getItem('apv_token')
                if(!token) return

                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clienteAxios('/pacientes', config)
                setPacientes(data)
            } catch (error) {
                console.log(error)
            }

        }
        obtenerPacientes();
    },[auth])

    const guardarPaciente = async(paciente) => {
        const token = localStorage.getItem('apv_token')

        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }

        if(paciente.id){
            try {
                const { data } = await clienteAxios.put(`/pacientes/${paciente.id}`, paciente, config)
                const pacientesActualizado = pacientes.map(pacienteState => pacienteState._id === data._id ? data : pacienteState ) 
                setPacientes(pacientesActualizado)
            } catch (error) {
                console.log(error)
            }
        } else {
            try {

                const {data} = await clienteAxios.post('/pacientes', paciente, config) // (url/datos/configuracion)
                const {createdAt, updatedAt, __v, ...pacienteAlmacenado} = data // Me crea un nuevo objeto sin estos campos(createdAt, updatedAt, __v), ese objeto es pacienteAlmacenado
                setPacientes([pacienteAlmacenado, ...pacientes])

            } catch (error)  {
                console.log(error.response.data.msg)
            }
        }
    }

    // Editar los datos de los pacientes(PASO 1)
    const editarPaciente = (paciente)=> {
        setPacienteEditado(paciente)
    }

    const eliminarPaciente = async id => {
        const handleDeleteConfirmation = async () =>{
            try {
                const token = localStorage.getItem('apv_token')

                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios.delete(`/pacientes/${id}`, config)
                const pacientesActualizado = pacientes.filter(pacienteState => pacienteState._id !== id) 
                setPacientes(pacientesActualizado)
            } catch (error) {
                console.log(error)
            }
        }

        deleteConfirmation({
            title: '',
            text: '¿Confirmas que deseas eliminar el Paciente? ',
            confirmButtonText: 'CONFIRMAR',
            onDelete: handleDeleteConfirmation
        });
    };

    return(
        <PacientesContext.Provider
            value={{
                pacientes,
                guardarPaciente,
                editarPaciente, 
                pacienteEditado, 
                eliminarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )
}

export default PacientesContext;