import React, { useState } from "react";

type AutoCompleteInputProps = {
    label?: string
    value: string
    onChange: (value: string) => void
    listaDeOpciones: string[]
    color?: string
}

export const AutoCompleteInput: React.FC<AutoCompleteInputProps> = ({
    value,
    onChange,
    listaDeOpciones,
    color = "text-white",
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const opcionesFiltradas = listaDeOpciones.filter((nombre) =>
        nombre.toLowerCase().includes(value.toLowerCase())
    )

    const handleSeleccion = (nombre: string) => {
        onChange(nombre);
        setIsFocused(false);
    }

    return (
        <div className="relative inline-block">
            <input
                type="text"
                value={value}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onChange={(e) => onChange(e.target.value)}
                className={`border rounded p-2 mr-2 bg-black border-gray-500 ${color}`}
                placeholder="Nombre del Pokémon"
            />
            {isFocused && opcionesFiltradas.length > 0 && (
                <ul className="absolute z-10 w-full  bg-black border border-gray-300 rounded shadow mt-1 max-h-40 overflow-y-auto">
                    {opcionesFiltradas.map((nombre, idx) => (
                        <li
                            key={idx}
                            onClick={() => handleSeleccion(nombre)}
                            className="p-2 hover:bg-blue-100 cursor-pointer text-white"
                        >
                            {nombre}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
