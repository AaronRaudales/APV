import { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import deleteConfirmation from "../components/SweetAlertsUtils";
import useAuth from "../hooks/useAuth";


const PacientesContext = createContext();

export const PacientesProvider = ({children}) => {

    const [pacientes, setPacientes] = useState([])
    const [paciente, setPaciente] = useState({})
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
                
            }
        } else {
            try {

                const {data} = await clienteAxios.post('/pacientes', paciente, config)
                const {createdAt, updatedAt, __v, ...pacienteAlmacenado} = data // Me crea un nuevo objeto sin estos campos(createdAt, updatedAt, __v)
                setPacientes([pacienteAlmacenado, ...pacientes])

            } catch (error)  {
                console.log(error.response.data.msg)
            }
        }
    }

    // Editar los datos de los pacientes
    const setEdicion = (paciente)=> {
        setPaciente(paciente)
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
            title: '¿Confirmas que deseas eliminar el Paciente?',
            text: 'Esta acción no se puede deshacer',
            confirmButtonText: 'Sí, eliminar',
            onDelete: handleDeleteConfirmation
        });
    };

    return(
        <PacientesContext.Provider
            value={{
                pacientes,
                guardarPaciente,
                setEdicion, 
                paciente, 
                eliminarPaciente
            }}
        >
            {children}
        </PacientesContext.Provider>
    )
}

export default PacientesContext;