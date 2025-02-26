import { useState } from "react"


function Packs() {
      const [pokemons, setPokemons] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState(false);
      const [isSaving, setIsSaving] = useState(false);
    
      // Función para abrir un sobre
      const openPack = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("http://localhost:4000/api/pokemon/getNewPokemons", {
            method: "GET",
            credentials: "include", // Para enviar cookies si hay autenticación
          });
    
          if (!response.ok) {
            throw new Error("Error al abrir el sobre");
          }
    
          const data = await response.json();
          setPokemons(data.pokemons); // Recibe un array de nombres de Pokémon
        } catch (error) {
          console.error("Error al abrir el sobre:", error);
        } finally {
          setIsLoading(false);
        }
      };
    
      // Función para guardar los Pokémon obtenidos
      const savePokemons = async () => {
        if (pokemons.length === 0) return alert("Primero abre un sobre.");
    
        setIsSaving(true);
        try {
          const response = await fetch("http://localhost:4000/api/packs/save", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pokemons }),
          });
    
          if (!response.ok) {
            throw new Error("Error al guardar los Pokémon");
          }
    
          alert("Pokémon guardados con éxito!");
        } catch (error) {
          console.error("Error al guardar Pokémon:", error);
        } finally {
          setIsSaving(false);
        }
      }
    
      return (
        <div className="flex flex-col items-center p-6">
          <h2 className="text-2xl font-bold mb-4">Abrir un Sobre de Pokémon</h2>
    
          {/* Botón para abrir un sobre */}
          <button
            onClick={openPack}
            disabled={isLoading}
            className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {isLoading ? "Abriendo..." : "Abrir Sobre"}
          </button>
    
          {pokemons.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              {pokemons.map((pokemon, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-200 rounded-lg text-center text-lg font-semibold"
                >
                  {pokemon}
                </div>
              ))}
            </div>
          )}
    
          {pokemons.length > 0 && (
            <button
              onClick={savePokemons}
              disabled={isSaving}
              className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:bg-gray-400"
            >
              {isSaving ? "Guardando..." : "Guardar Pokémon"}
            </button>
          )}
        </div>
      )
    }
      
export default Packs