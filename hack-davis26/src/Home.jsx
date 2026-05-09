import {Utensils, Search, Eye} from "lucide-react"
import { Link } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Facts from './Facts'
import Card from './Card'

function Home() {
  const cardData = [
    {
      img: <Utensils size={30}/>,
      title: "Calorie Breakdown",
      description: "See exactly how many calories per serving"
    },
    {
      img: <Search size={30}/>,
      title: "Ingredient Analysis",
      description: "Plain-English explainations of complex names"
    },
    {
      img: <Eye size={30}/>,
      title: "Hidden Activities",
      description: "We highlight what brands don't want you to see"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex flex-col gap-8 px-6 py-8 grow">
        <Link to="/scan" className="self-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700">
          Scan a Label
        </Link>

        <div className="flex flex-col gap-4">
          {cardData.map((card) => (
            <Card
              key={card.title}
              img={card.img}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div className="flex flex-row flex-wrap gap-2">
          <Facts paragraph="Red 40" />
          <Facts paragraph="Yellow 5" />
          <Facts paragraph="Blue 1" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home
