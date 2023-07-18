import { useState } from "react"
import usePacientes from "../hooks/usePacientes"
import Paciente from "./Paciente"

const ListadoPacientes = () => {

  const { pacientes } = usePacientes()

  return (
    <>
      { pacientes.length ? (
        <>
          <h2 className="font-black text-3xl text-center">Listado Pacientes</h2>
          <p className="text-xl mt-5 mb-10 text-center"> 
            Administra tus  {''}
            <span className="text-indigo-600 font-bold">Pacientes y Citas</span>
          </p>

          {pacientes.map( (paciente) => ( // paciente es una variable temporal
            <Paciente
              key={paciente._id} // Cuando se este iterando sobre un arreglo es necesario un key
              paciente = {paciente}
            />
          ))}
        </>
      ) : (
        <>
          <h2 className="font-black text-3xl text-center">No hay Pacientes</h2>
          <p className="text-xl mt-5 mb-10 text-center">
            Comienza agregando Pacientes {''}
            <span className="text-indigo-600 font-bold">y aparecerán en este lugar</span>
          </p>
        </>
      )}
    </>
  )
}

export default ListadoPacientes