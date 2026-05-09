import {Camera, Utensils, Search, Eye} from "lucide-react"
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
      description: "See exactly how many calories per serving",
      bgColor: "bg-purple-50",
      iconColor: "bg-purple-300",
    },
    {
      img: <Search size={30}/>,
      title: "Ingredient Analysis",
      description: "Plain-English explainations of complex names",
      bgColor: "bg-purple-50",
      iconColor: "bg-blue-300",
    },
    {
      img: <Eye size={30}/>,
      title: "Hidden Activities",
      description: "We highlight what brands don't want you to see",
      bgColor: "bg-purple-50",
      iconColor: "bg-red-300",
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f3f8]">
      <Header />

      <main className="flex flex-col gap-8 px-6 py-8 grow">
        <div className="bg-purple-50 rounded-2xl px-8 py-10 shadow-sm flex flex-col items-center text-center gap-3">
          <span className="text-4xl">🔍</span>
          <h1 className="text-3xl font-black text-indigo-900">Know what's in your food</h1>
          <p className="text-slate-500 max-w-md">
            Flip over the label, point your camera, and Flipit breaks down every ingredient and flags every
            harmful additives brands hide in plain sight.
          </p>
          <div className="flex gap-6 mt-2 text-sm text-slate-600">
            <span>📸 Scan a label</span>
            <span>→</span>
            <span>🧪 AI analyzes ingredients</span>
            <span>→</span>
            <span>✅ Get a safety grade</span>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/scan" className="group relative flex h-50 w-50 items-center justify-center rounded-[32px] bg-purple-50 transition hover:scale-105 hover:shadow-lg">
            <Camera size={50} className="text-purple-500 transition group-hover:text-purple-400" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {cardData.map((card) => (
            <Card
              key={card.title}
              img={card.img}
              title={card.title}
              description={card.description}
              bgColor={card.bgColor}
              iconColor={card.iconColor}
            />
          ))}
        </div>

        <h2 className="text-xl font-bold text-slate-800">Ingredients to watch out for</h2>
        <div className="flex flex-row flex-wrap gap-2">
          <Facts paragraph="Red 40" color="text-red-700 border-red-300" />
          <Facts paragraph="Yellow 5" color="text-yellow-600 border-yellow-300" />
          <Facts paragraph="Blue 1" color="text-blue-700 border-blue-300" />
          <Facts paragraph="High Fructose Corn Syrup" color="text-orange-700 border-orange-300" />
          <Facts paragraph="BHA / BHT" color="text-purple-700 border-purple-300" />
          <Facts paragraph="Sodium Nitrate" color="text-pink-700 border-pink-300" />
          <Facts paragraph="Trans Fats" color="text-red-800 border-red-400" />
          <Facts paragraph="Carrageenan" color="text-teal-700 border-teal-300" />
          <Facts paragraph="Aspartame" color="text-indigo-700 border-indigo-300" />
          <Facts paragraph="Propyl Gallate" color="text-amber-700 border-amber-300" />
          <Facts paragraph="Sodium Benzoate" color="text-rose-700 border-rose-300" />
          <Facts paragraph="Potassium Bromate" color="text-cyan-700 border-cyan-300" />
          <Facts paragraph="TBHQ" color="text-lime-700 border-lime-300" />
          <Facts paragraph="Acesulfame K" color="text-violet-700 border-violet-300" />
          <Facts paragraph="Artificial Flavors" color="text-slate-700 border-slate-300" />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Home
