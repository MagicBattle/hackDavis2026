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
    <>
      <Header />
      <Link to="/scan">Scan a Label</Link>
      {cardData.map((card) => (
      <Card
        img={card.img}
        title={card.title}
        description={card.description}
      />
    ))} 
          <div className="facts-container">
        <Facts paragraph="Red 40" />
        <Facts paragraph="Yellow 5" />
        <Facts paragraph="Blue 1" />
      </div>
      <Footer />
    </>
  );
}

export default Home
