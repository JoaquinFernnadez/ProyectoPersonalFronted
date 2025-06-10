import { useEffect, useState } from "react"
import Article from "../models/News"
import LoadingScreen from "../components/LoadingScreen"


const API_URL_BASE = import.meta.env.VITE_API_URL_BASE

function News() {

    const [news, setNews] = useState<Article[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        async function fetchNews() {
            try {
                const response = await fetch(API_URL_BASE + `/pokemon/news`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                })
                const data = await response.json()
                setNews(data)
            } catch (error) {
                const msg = error instanceof Error ? error.message : 'Error desconocido'
                console.log(msg)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [])



    return (
        <div className="  p-4 bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950 min-h-1020 w-full"> 
        <div className="container  p-4  min-h-1020 w-full">
            <h1 className="text-3xl text-white font-bold text-center mb-6">Últimas Noticias</h1>
            {loading ? (
                <LoadingScreen/>
            ) : (
                <>
                    {news.length === 0 ? (
                        <p className="text-center text-lg">No hay noticias disponibles en este momento.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">

                            {news.map((article, index) => (
                                <div key={index} className="bg-amber-100 shadow-lg rounded-lg p-4 hover:shadow-xl transition-shadow duration-200">

                                    {article.urlToImage && (
                                        <img
                                            src={article.urlToImage}
                                            alt={article.title}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                    )}

                                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>

                                    <p className="text-gray-700 mb-4">{article.description}</p>

                                    <div className="text-sm text-gray-500">
                                        <p>Publicado el {new Date(article.publishedAt).toLocaleDateString("es-ES")}</p>
                                        <p>Por {article.author}</p>
                                    </div>
                                    <a
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-4 w-24 px-4 py-2   bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                                    >
                                        Leer más
                                    </a>

                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
        </div>
    )
}

export default News


