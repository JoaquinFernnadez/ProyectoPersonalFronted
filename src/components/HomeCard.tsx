import { useNavigate } from "react-router-dom"

type HomeCardProps = {
    title: string;
    description: string;
    image: string;
    route: string;
    gradient: string;
  }

const HomeCard: React.FC<HomeCardProps> = ({ title, description, image, route, gradient }) => {
  const navigate = useNavigate()

  return (
    <div className="flex max-w-sm border-gray-200 rounded-lg shadow-sm dark:border-gray-700 m-2">
      <div className="flex flex-col p-5 rounded">
        <img src={image} className="rounded h-55" alt={title} />
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900 dark:text-blue-700">
          {title}
        </h5>
        <p className="mb-3 font-normal text-green-300">
          {description}
        </p>
        <button
          className={`mt-auto cursor-pointer w-full text-blue-300 border border-gray-600 bg-gradient-to-br ${gradient} h-10 rounded`}
          onClick={() => navigate(route)}
        >
          GO
        </button>
      </div>
    </div>
  )
}

export default HomeCard
