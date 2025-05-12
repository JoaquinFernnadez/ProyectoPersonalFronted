const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white p-6 min-h-screen">

            <img src="src/images/poketu.png" className="pb-15"></img>

            {/* <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500 mb-4"></div> */}
            <img
                src="src/images/pokeball2.png"
                alt="Pokéball Spinner"
                className="w-24 h-24 animate-spin mb-4 rounded-full"
            />

            <p className="text-xl mb-4 py-5 text-blue-400">Cargando...</p>

            { /* God Animacion */}
            <div className="flex justify-center items-center space-x-4 mb-4 pt-5">
                <img
                    src="src/images/1.png"
                    alt="Pokémon"
                    className="w-16 h-16 animate-ping"
                />
                <img
                    src="src/images/4.png"
                    alt="Pokémon"
                    className="w-16 h-16 animate-ping"
                />
                <img
                    src="src/images/7.png"
                    alt="Pokémon"
                    className="w-16 h-16 animate-ping"
                />
            </div>
        </div>
    )
}

export default LoadingScreen
